import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Monthly spending
    const months: { month: string; spent: number; orders: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

      const agg = await prisma.order.aggregate({
        where: { userId: user.id, createdAt: { gte: start, lte: end } },
        _sum: { charge: true },
        _count: { id: true }
      });

      months.push({
        month: monthNames[start.getMonth()],
        spent: agg._sum.charge || 0,
        orders: agg._count.id
      });
    }

    // Top services
    const allOrders = await prisma.order.findMany({
      where: { userId: user.id },
      select: { service: true, charge: true }
    });

    const serviceMap: Record<string, { count: number; total: number }> = {};
    allOrders.forEach(o => {
      if (!serviceMap[o.service]) serviceMap[o.service] = { count: 0, total: 0 };
      serviceMap[o.service].count++;
      serviceMap[o.service].total += o.charge;
    });

    const topServices = Object.entries(serviceMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, count: data.count, total: data.total }));

    // Total stats
    const totalSpent = allOrders.reduce((s, o) => s + o.charge, 0);
    const totalOrders = allOrders.length;

    // This month stats
    const thisMonthOrders = await prisma.order.aggregate({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
      _sum: { charge: true },
      _count: { id: true }
    });

    // Savings estimate (competitor prices are ~40% higher)
    const savings = totalSpent * 0.4;

    return NextResponse.json({
      totalSpent,
      totalOrders,
      thisMonthSpent: thisMonthOrders._sum.charge || 0,
      thisMonthOrders: thisMonthOrders._count.id,
      savings: savings.toFixed(2),
      monthlyHistory: months,
      topServices,
      memberSince: user.createdAt
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
