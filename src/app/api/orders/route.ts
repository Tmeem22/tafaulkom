import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderOrder, getProviderOrderStatuses } from '@/lib/smm-api';
import { getUserFromSession } from '@/lib/auth';

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
    const { serviceId, serviceName, link, quantity, charge } = body;

    // 1. Validate data
    if (!serviceId || !link || !quantity || !charge) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Check Balance
    if (user.balance < Number(charge)) {
      return NextResponse.json({ error: 'الرصيد غير كافٍ' }, { status: 400 });
    }

    // 3. Send order to Provider
    const providerResponse = await createProviderOrder(serviceId, link, quantity);
    
    if (providerResponse.error) {
      const errStr = providerResponse.error.toLowerCase();
      if (errStr.includes('fund') || errStr.includes('balance')) {
        return NextResponse.json({ error: 'عذراً، السيرفرات متوقفة مؤقتاً للصيانة والتحديث. يرجى المحاولة لاحقاً.' }, { status: 400 });
      }
      return NextResponse.json({ error: providerResponse.error }, { status: 400 });
    }

    // 4. Deduct balance and Save order
    const providerOrderId = providerResponse.order ? String(providerResponse.order) : String(Math.floor(Math.random() * 1000000)); 
    
    const newBalance = user.balance - Number(charge);
    
    // Update balance
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: newBalance }
    });

    // Create order
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        providerOrderId: providerOrderId,
        service: serviceName || `Service #${serviceId}`,
        link,
        quantity: Number(quantity),
        charge: Number(charge),
        remains: Number(quantity),
        status: 'pending',
      }
    });

    return NextResponse.json({ 
      success: true, 
      order: newOrder,
      newBalance
    });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
