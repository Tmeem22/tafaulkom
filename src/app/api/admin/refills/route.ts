import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { createProviderRefill } from '@/lib/smm-api';

export async function GET(req: Request) {
  try {
    const isAuth = await verifyAuth(req);
    if (!isAuth || isAuth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pendingRefills = await prisma.order.findMany({
      where: {
        refillRequested: true,
        refillStatus: 'PENDING'
      },
      include: {
        user: {
          select: { username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(pendingRefills);
  } catch (error) {
    console.error("Admin Refill GET Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const isAuth = await verifyAuth(req);
    if (!isAuth || isAuth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, action } = await req.json(); // action: 'APPROVE' or 'REJECT'

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) }
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (action === 'APPROVE') {
      // Call Provider API
      const result = await createProviderRefill(order.providerOrderId);
      
      if (result.error) {
        return NextResponse.json({ error: `Provider Error: ${result.error}` }, { status: 400 });
      }

      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { refillStatus: 'APPROVED' }
      });

      return NextResponse.json({ success: true, message: 'Refill approved and sent to provider' });
    } else {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { refillStatus: 'REJECTED' }
      });
      return NextResponse.json({ success: true, message: 'Refill rejected' });
    }
  } catch (error) {
    console.error("Admin Refill PATCH Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
