import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      select: {
        charge: true,
        status: true,
      },
    });

    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.charge, 0);
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

    return NextResponse.json({
      totalSpent: totalSpent.toFixed(2),
      totalOrders,
      pendingOrders,
      accountStatus: 'مدقق', // Default for now
    });
  } catch (error) {
    console.error("User Stats Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
