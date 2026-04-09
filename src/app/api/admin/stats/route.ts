import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const isAuth = await verifyAuth(req);
    if (!isAuth || isAuth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      totalSalesData,
      pendingDeposits,
      openTickets,
      recentDeposits
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { charge: true }
      }),
      prisma.deposit.count({
        where: { status: 'pending' }
      }),
      prisma.ticket.count({
        where: { status: 'open' }
      }),
      prisma.deposit.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { username: true } }
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSales: totalSalesData._sum.charge || 0,
        pendingDeposits,
        openTickets
      },
      recentDeposits
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
