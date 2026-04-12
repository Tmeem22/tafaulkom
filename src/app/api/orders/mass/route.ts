import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderOrder } from '@/lib/smm-api';
import { getUserFromSession } from '@/lib/auth';
import { USD_TO_SAR_RATE, DEFAULT_PROFIT_MARGIN, CURRENCY_SYMBOL } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orders } = await request.json(); // array of { serviceId, link, quantity }
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ error: 'الرجاء إدخال بيانات صحيحة' }, { status: 400 });
    }

    if (orders.length > 50) {
      return NextResponse.json({ error: 'الحد الأقصى للطلبات في المرة الواحدة هو 50 طلب' }, { status: 400 });
    }

    // Process validations upfront to ensure funds
    let totalCost = 0;
    const validatedOrders = [];

    // Pre-fetch all requested services
    const serviceIds = Array.from(new Set(orders.map(o => Number(o.serviceId))));
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds }, active: true }
    });

    const serviceMap = new Map(services.map(s => [s.id, s]));

    for (let i = 0; i < orders.length; i++) {
      const { serviceId, link, quantity } = orders[i];
      const sid = Number(serviceId);
      const qty = Number(quantity);

      if (!sid || !link || !qty) {
        return NextResponse.json({ error: \`السطر \${i + 1} يفتقد بعض البيانات\` }, { status: 400 });
      }

      const svc = serviceMap.get(sid);
      if (!svc) {
        return NextResponse.json({ error: \`الخدمة \${sid} غير متوفرة (السطر \${i + 1})\` }, { status: 400 });
      }

      if (qty < svc.min || qty > svc.max) {
        return NextResponse.json({ error: \`لخدمة \${sid} الكمية يجب أن تكون بين \${svc.min} و \${svc.max}\` }, { status: 400 });
      }

      const costInSar = svc.originalRate * USD_TO_SAR_RATE;
      const ratePer1000 = svc.customRate ? svc.customRate : costInSar * DEFAULT_PROFIT_MARGIN;
      const charge = (qty / 1000) * ratePer1000;
      
      totalCost += charge;

      validatedOrders.push({
        service: svc,
        link,
        quantity: qty,
        charge
      });
    }

    // Check Balance
    if (user.balance < totalCost) {
      return NextResponse.json({ error: \`رصيدك غير كافٍ. إجمالي التكلفة هو \${totalCost.toFixed(3)} \${CURRENCY_SYMBOL}\` }, { status: 400 });
    }

    // Process Orders via Provider and DB
    let currentUserBalance = user.balance;
    let successCount = 0;
    let pointsToAdd = 0;
    
    for (const vOrder of validatedOrders) {
      try {
        const providerResponse = await createProviderOrder(vOrder.service.id, vOrder.link, vOrder.quantity);
        
        if (!providerResponse.error && providerResponse.order) {
           currentUserBalance -= vOrder.charge;
           pointsToAdd += (vOrder.charge < 10 ? 10 : 50);

           await prisma.$transaction([
             prisma.user.update({
               where: { id: user.id },
               data: { balance: currentUserBalance, points: { increment: pointsToAdd } }
             }),
             prisma.order.create({
               data: {
                 userId: user.id,
                 providerOrderId: String(providerResponse.order),
                 service: vOrder.service.name,
                 link: vOrder.link,
                 quantity: vOrder.quantity,
                 charge: vOrder.charge,
                 remains: vOrder.quantity,
                 status: 'pending'
               }
             })
           ]);
           successCount++;
        }
      } catch (err) {
        console.error("Mass Order Item Error:", err);
        // Continue trying other orders even if one fails
      }
    }

    if (successCount === 0) {
      return NextResponse.json({ error: 'عذراً، فشل تنفيذ جميع الطلبات بسبب مشكلة في المزود الأساسي' }, { status: 500 });
    }

    // Optional Affiliate Logic
    if (user.referredById && totalCost > 0) {
      const commission = totalCost * 0.015;
      try {
          await prisma.$transaction([
              prisma.user.update({ where: { id: user.referredById }, data: { totalCommission: { increment: commission } } }),
              prisma.notification.create({
                  data: {
                      userId: user.referredById,
                      title: 'عمولة طلب جماعي! 🛒',
                      message: \`حصلت على \${commission.toFixed(4)} \${CURRENCY_SYMBOL} عمولة نظير طلب ضخم لإحدى إحالاتك.\`
                  }
              })
          ]);
      } catch(e) {}
    }

    return NextResponse.json({
      success: true,
      message: \`تم تنفيذ \${successCount} طلب بنجاح مخصوماً من الرصيد.\`,
      totalCost,
      newBalance: currentUserBalance
    });

  } catch (error) {
    console.error("Mass Order API Error:", error);
    return NextResponse.json({ error: 'حدث خطأ داخلي في الخادم' }, { status: 500 });
  }
}
