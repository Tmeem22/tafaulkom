import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderOrder, getProviderOrderStatuses } from '@/lib/smm-api';
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
    const { serviceId, link, quantity } = body;

    // 1. Validate basic input
    if (!serviceId || !link || !quantity) {
      return NextResponse.json({ error: 'الرجاء إدخال كافة الحقول المطلوبة' }, { status: 400 });
    }

    // 2. Fetch service from DB to get the actual rate and limits
    const service = await prisma.service.findUnique({
      where: { id: Number(serviceId) }
    });

    if (!service || !service.active) {
      return NextResponse.json({ error: 'الخدمة المختارة غير متوفرة حالياً' }, { status: 400 });
    }

    // 3. Validate Quantity
    if (quantity < service.min || quantity > service.max) {
      return NextResponse.json({ 
        error: `الكمية يجب أن تكون بين ${service.min} و ${service.max}` 
      }, { status: 400 });
    }

    // 4. Calculate Charge on Backend
    const costInSar = service.originalRate * USD_TO_SAR_RATE;
    const ratePer1000 = service.customRate ? service.customRate : costInSar * DEFAULT_PROFIT_MARGIN;
    const finalCharge = (quantity / 1000) * ratePer1000;

    // 5. Check Balance
    if (user.balance < finalCharge) {
      return NextResponse.json({ error: 'رصيدك غير كافٍ لإتمام هذا الطلب' }, { status: 400 });
    }

    // 6. Send order to Provider
    const providerResponse = await createProviderOrder(service.id, link, quantity);
    
    if (providerResponse.error) {
      console.error("[Order API] Provider Error:", providerResponse.error);
      const errStr = providerResponse.error.toLowerCase();
      if (errStr.includes('fund') || errStr.includes('balance')) {
        return NextResponse.json({ error: 'عذراً، السيرفرات متوقفة مؤقتاً للصيانة. يرجى المحاولة لاحقاً.' }, { status: 400 });
      }
      return NextResponse.json({ error: providerResponse.error }, { status: 400 });
    }

    // 7. Deduct balance and Save order
    const providerOrderId = providerResponse.order ? String(providerResponse.order) : null;
    
    if (!providerOrderId) {
      return NextResponse.json({ error: 'فشل في الحصول على رقم الطلب من المزود' }, { status: 400 });
    }

    const newBalance = user.balance - finalCharge;
    
    // Use a transaction for reliability
    const [updatedUser, newOrder] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance }
      }),
      prisma.order.create({
        data: {
          userId: user.id,
          providerOrderId: providerOrderId,
          service: service.name,
          link,
          quantity: Number(quantity),
          charge: finalCharge,
          remains: Number(quantity),
          status: 'pending',
        }
      })
    ]);

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
