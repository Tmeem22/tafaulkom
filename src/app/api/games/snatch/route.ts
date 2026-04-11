import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { dropId } = await req.json();
    if (!dropId) return NextResponse.json({ error: 'Data required' }, { status: 400 });

    // Use transaction to ensure exact-once snatching
    const result = await prisma.$transaction(async (tx) => {
      const drop = await tx.gameDrop.findUnique({ where: { id: dropId } });
      if (!drop || drop.status !== 'ACTIVE') throw new Error("الباقة مباعة أو غير متاحة");

      const dbUser = await tx.user.findUnique({ where: { id: user.id } });
      if (!dbUser || dbUser.balance < drop.currentPrice) throw new Error("رصيدك غير كافٍ لشراء الباقة");

      // Update drop to SOLD
      const soldDrop = await tx.gameDrop.update({
        where: { id: dropId },
        data: { status: 'SOLD', winnerId: user.id }
      });

      // Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: drop.currentPrice } }
      });

      // Add to inventory
      await tx.inventoryItem.create({
         data: {
            userId: user.id,
            name: drop.title,
            description: drop.prizeDescription,
            type: 'REVERSE_AUCTION',
            serviceId: drop.serviceId,
            quantity: drop.quantity
         }
      });

      return soldDrop;
    });

    return NextResponse.json({ success: true, drop: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
