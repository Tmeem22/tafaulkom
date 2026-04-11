import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderOrder, createProviderSubscription, getProviderOrderStatuses } from '@/lib/smm-api';
import { getUserFromSession } from '@/lib/auth';
import { USD_TO_SAR_RATE, DEFAULT_PROFIT_MARGIN } from '@/lib/constants';

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get all user's orders
    const userOrders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const pendingOrders = userOrders.filter(o => 
      o.status !== 'completed' && o.status !== 'cancelled'
    );

    // 2. Sync with provider if there are any pending orders
    if (pendingOrders.length > 0) {
      const providerIds = pendingOrders.map(o => o.providerOrderId);
      const statuses = await getProviderOrderStatuses(providerIds);

      for (const order of userOrders) {
        if (order.providerOrderId && statuses[order.providerOrderId]) {
          const pStatus = statuses[order.providerOrderId];
          
          let newStatus = order.status;
          if (pStatus.status) {
            const s = pStatus.status.toLowerCase();
            if (s === 'completed') newStatus = 'completed';
            else if (s === 'canceled' || s === 'cancelled') newStatus = 'cancelled';
            else if (s === 'processing' || s === 'in progress') newStatus = 'processing';
            else if (s === 'pending') newStatus = 'pending';
          }

          const providerRemains = pStatus.remains ? Number(pStatus.remains) : 0;
          const providerStartCount = pStatus.start_count ? Number(pStatus.start_count) : order.startCount;

          if (order.status !== newStatus || order.remains !== providerRemains) {
            order.status = newStatus;
            order.remains = providerRemains;
            order.startCount = providerStartCount;
            
            // Save updates in DB
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: newStatus,
                remains: providerRemains,
                startCount: providerStartCount
              }
            });
          }
        }
      }
    }
    
    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Orders Sync Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, link, quantity, isSubscription, username, minQty, maxQty, posts, delay } = body;

    // 1. Validate basic input
    if (!serviceId) {
      return NextResponse.json({ error: 'الرجاء إدخال كافة الحقول المطلوبة' }, { status: 400 });
    }

    if (isSubscription) {
      if (!username || !minQty || !maxQty || !posts) {
        return NextResponse.json({ error: 'الرجاء إدخال الحقول المطلوبة للاشتراك.' }, { status: 400 });
      }
    } else {
      if (!link || !quantity) {
        return NextResponse.json({ error: 'الرجاء إدخال كافة الحقول المطلوبة' }, { status: 400 });
      }
    }

    // 2. Fetch service from DB to get the actual rate and limits
    const service = await prisma.service.findUnique({
      where: { id: Number(serviceId) }
    });

    if (!service || !service.active) {
      return NextResponse.json({ error: 'الخدمة المختارة غير متوفرة حالياً' }, { status: 400 });
    }

    // 3. Validate Quantity
    let totalQuantity = 0;
    if (isSubscription) {
      if (minQty < service.min || maxQty > service.max || minQty > maxQty) {
        return NextResponse.json({ 
          error: `كمية الاشتراك يجب أن تكون بين ${service.min} و ${service.max}` 
        }, { status: 400 });
      }
      totalQuantity = Number(posts) * Number(maxQty);
    } else {
      if (quantity < service.min || quantity > service.max) {
        return NextResponse.json({ 
          error: `الكمية يجب أن تكون بين ${service.min} و ${service.max}` 
        }, { status: 400 });
      }
      totalQuantity = Number(quantity);
    }

    // 4. Calculate Charge on Backend
    const costInSar = service.originalRate * USD_TO_SAR_RATE;
    const ratePer1000 = service.customRate ? service.customRate : costInSar * DEFAULT_PROFIT_MARGIN;
    const finalCharge = (totalQuantity / 1000) * ratePer1000;

    // 5. Check Balance
    if (user.balance < finalCharge) {
      return NextResponse.json({ error: 'رصيدك غير كافٍ لإتمام هذا الطلب' }, { status: 400 });
    }

    // 6. Send order to Provider
    let providerResponse;
    
    // Check if we need to call createProviderOrder or createProviderSubscription
    if (isSubscription) {
      providerResponse = await createProviderSubscription(service.id, username, minQty, maxQty, posts, delay || 0);
    } else {
      providerResponse = await createProviderOrder(service.id, link, quantity);
    }
    
    if (providerResponse.error) {
      console.error("[Order API] Provider Error:", providerResponse.error);
      const errStr = providerResponse.error.toLowerCase();
      if (errStr.includes('fund') || errStr.includes('balance')) {
        return NextResponse.json({ error: 'عذراً، السيرفرات متوقفة مؤقتاً للصيانة. يرجى المحاولة لاحقاً.' }, { status: 400 });
      }
      return NextResponse.json({ error: providerResponse.error }, { status: 400 });
    }

    // 7. Deduct balance and Save order
    const providerOrderId = (providerResponse.order || providerResponse.subscription) ? String(providerResponse.order || providerResponse.subscription) : null;
    
    if (!providerOrderId) {
      return NextResponse.json({ error: 'فشل في الحصول على رقم الطلب من المزود' }, { status: 400 });
    }

    const pointsToAdd = finalCharge < 10 ? 10 : 50;
    const newBalance = user.balance - finalCharge;
    
    const dbLink = isSubscription ? username : link;
    const dbService = isSubscription ? `${service.name} (اشتراك لـ ${posts} بوست)` : service.name;

    // Use a transaction for reliability
    const [updatedUser, newOrder] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { 
          balance: newBalance,
          points: { increment: pointsToAdd }
        }
      }),
      prisma.order.create({
        data: {
          userId: user.id,
          providerOrderId: providerOrderId,
          service: dbService,
          link: dbLink,
          quantity: totalQuantity,
          charge: finalCharge,
          remains: totalQuantity,
          status: 'pending',
        }
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'نقاط مكافأة جديدة 🪙',
          message: `مبروك! حصلت على ${pointsToAdd} نقطة لإتمامك هذا الطلب.`
        }
      })
    ]);

    // Affiliate Commission (1.5%)
    if (user.referredById) {
      const commission = finalCharge * 0.015;
      await prisma.$transaction([
        prisma.referral.create({
          data: {
            referrerId: user.referredById,
            referredId: user.id,
            orderId: newOrder.id,
            orderAmount: finalCharge,
            commission
          }
        }),
        prisma.user.update({
          where: { id: user.referredById },
          data: { totalCommission: { increment: commission } }
        }),
        prisma.notification.create({
          data: {
            userId: user.referredById,
            title: 'عمولة جديدة! 💰',
            message: `حصلت على ${commission.toFixed(4)}$ عمولة من عملية شراء أحد إحالاتك.`
          }
        })
      ]);
    }

    return NextResponse.json({ 
      success: true, 
      order: newOrder,
      newBalance: updatedUser.balance
    });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ error: 'حدث خطأ داخلي في الخادم' }, { status: 500 });
  }
}
