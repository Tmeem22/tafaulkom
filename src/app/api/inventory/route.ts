import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Attempt standard fetch
    const items = await (prisma.inventoryItem as any).findMany({
      where: { 
        userId: user.id,
        isUsed: false 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Inventory Fetch Error:", error);
    // Fallback: If columns are missing, this might fail.
    // Return empty array to prevent frontend crash
    return NextResponse.json([]);
  }
}
