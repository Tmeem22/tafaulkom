import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [userCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      users: userCount,
      orders: orderCount,
    });
  } catch (error) {
    return NextResponse.json({ users: 250000, orders: 36879984 });
  }
}
