import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const items = await prisma.inventoryItem.findMany({
      where: { 
        userId: user.id,
        isUsed: false 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
