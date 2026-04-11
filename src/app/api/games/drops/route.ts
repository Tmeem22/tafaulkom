import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const activeDrops = await prisma.gameDrop.findMany({
    where: { status: { in: ['WAITING', 'ACTIVE'] } },
    orderBy: { startTime: 'asc' },
    take: 1
  });

  if (activeDrops.length > 0) {
    const drop = activeDrops[0] as any;
    const now = new Date();
    
    // Status Transitions
    if (drop.status === 'WAITING' && new Date(drop.startTime).getTime() <= Date.now()) {
      await prisma.gameDrop.update({
         where: { id: drop.id },
         data: { status: 'ACTIVE' }
      });
      drop.status = 'ACTIVE';
    }

    // Logic for REVERSE AUCTION Price Update
    if (drop.status === 'ACTIVE' && drop.type === 'REVERSE_AUCTION') {
      const secondsSinceStart = Math.floor((Date.now() - new Date(drop.startTime).getTime()) / 1000);
      const ticks = Math.floor(secondsSinceStart / (drop.dropIntervalSeconds || 1));
      
      let newPrice = drop.startPrice - (ticks * (drop.dropAmount || 0));
      if (newPrice < (drop.minPrice || 0)) newPrice = drop.minPrice || 0;

      if (newPrice !== drop.currentPrice) {
        await prisma.gameDrop.update({
          where: { id: drop.id },
          data: { currentPrice: newPrice }
        });
        drop.currentPrice = newPrice;
      }
    }

    // Logic for STANDARD AUCTION Completion
    if (drop.status === 'ACTIVE' && drop.type === 'STANDARD_AUCTION' && drop.endTime && now > new Date(drop.endTime)) {
        // Auction Ended! Finalize it.
        await prisma.$transaction(async (tx) => {
            await (tx.gameDrop as any).update({
                where: { id: drop.id },
                data: { status: 'SOLD', winnerId: drop.highestBidderId }
            });

            if (drop.highestBidderId) {
                // Safe create (avoiding crash if DB columns are missing)
                await (tx.inventoryItem as any).create({
                    data: {
                        userId: drop.highestBidderId,
                        name: `[مزاد] ${drop.title}`,
                        description: `${drop.prizeDescription}${drop.serviceId ? ` [Service:${drop.serviceId}|Qty:${drop.quantity}]` : ''}`,
                        type: 'STANDARD_AUCTION'
                    }
                });
                
                await tx.notification.create({
                    data: {
                        userId: drop.highestBidderId,
                        title: '🥳 مبروك! فزت بالمزاد',
                        message: `لقد ربحت مزاد "${drop.title}". الجائزة الآن متوفرة في خزننتك.`
                    }
                });
            }
        });
        drop.status = 'SOLD';
    }
    
    return NextResponse.json([drop]);
  }

  return NextResponse.json([]);
}
