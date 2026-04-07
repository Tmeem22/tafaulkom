import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [ordersCount, usersCount, totalRevenueResult, pendingTicketsCount] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: {
          charge: true
        }
      }),
      prisma.ticket.count({
        where: { status: 'open' }
      })
    ]);

    return NextResponse.json({
      totalOrders: ordersCount,
      totalUsers: usersCount,
      totalRevenue: (totalRevenueResult._sum.charge || 0).toFixed(2),
      openTickets: pendingTicketsCount
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
