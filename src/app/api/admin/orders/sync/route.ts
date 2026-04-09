import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getProviderOrderStatuses } from '@/lib/smm-api';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const isAuth = await verifyAuth(req);
    if (!isAuth || isAuth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all non-finalized orders
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ['pending', 'processing', 'inprogress', 'partial']
        }
      }
    });

    if (pendingOrders.length === 0) {
      return NextResponse.json({ message: 'No pending orders to sync' });
    }

    const providerIds = pendingOrders.map(o => o.providerOrderId).filter(Boolean);
    if (providerIds.length === 0) {
      return NextResponse.json({ message: 'No provider order IDs found' });
    }

    // The provider API might have a limit on how many IDs can be sent at once.
    // Usually, 100 is a safe bet.
    const CHUNK_SIZE = 100;
    let syncedCount = 0;

    for (let i = 0; i < providerIds.length; i += CHUNK_SIZE) {
      const chunk = providerIds.slice(i, i + CHUNK_SIZE);
      const statuses = await getProviderOrderStatuses(chunk);

      for (const order of pendingOrders) {
        if (order.providerOrderId && statuses[order.providerOrderId]) {
          const pStatus = statuses[order.providerOrderId];
          
          let newStatus = order.status;
          if (pStatus.status) {
            const s = pStatus.status.toLowerCase();
            if (s === 'completed') newStatus = 'completed';
            else if (s === 'canceled' || s === 'cancelled') newStatus = 'cancelled';
            else if (s === 'processing' || s === 'in progress' || s === 'inprogress') newStatus = 'processing';
            else if (s === 'pending') newStatus = 'pending';
            else if (s === 'partial') newStatus = 'partial';
          }

          const providerRemains = pStatus.remains ? Number(pStatus.remains) : 0;
          const providerStartCount = pStatus.start_count ? Number(pStatus.start_count) : order.startCount;

          if (order.status !== newStatus || order.remains !== providerRemains) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: newStatus,
                remains: providerRemains,
                startCount: providerStartCount
              }
            });
            syncedCount++;
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} orders.`,
      totalPending: pendingOrders.length
    });

  } catch (error) {
    console.error("Admin Order Sync Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
