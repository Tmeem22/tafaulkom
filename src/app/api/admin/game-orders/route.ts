import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  const admin = await getUserFromSession();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Get items that are isUsed=true (claimed by user) and are NOT balance prizes (contain "رابط التنفيذ")
    const items = await prisma.inventoryItem.findMany({
      where: {
        isUsed: true,
        description: { contains: 'رابط التنفيذ' }
      },
      include: {
        user: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
