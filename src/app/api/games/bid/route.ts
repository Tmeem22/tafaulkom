import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { auctionId, bidAmount } = await req.json();
    if (!auctionId || !bidAmount) return NextResponse.json({ error: 'Data required' }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      // 1. Get auction (casting to any to access new fields not yet in generated types)
      const auction = await (tx.gameDrop as any).findUnique({ where: { id: auctionId } });
      if (!auction || auction.type !== 'STANDARD_AUCTION' || auction.status !== 'ACTIVE') {
        throw new Error("المزاد غير متاح حالياً");
      }

      // 2. Check if expired
      if (auction.endTime && new Date() > new Date(auction.endTime)) {
        throw new Error("انتهى وقت المزاد");
      }

      // 3. Validate Bid Amount
      const currentHighest = auction.highestBid || auction.startPrice;
      if (Number(bidAmount) <= currentHighest) {
        throw new Error(`يجب أن تكون المزايدة أعلى من السعر الحالي (${currentHighest} ر.س)`);
      }

      // 4. Check User Balance
      const dbUser = await tx.user.findUnique({ where: { id: user.id } });
      if (!dbUser || dbUser.balance < Number(bidAmount)) {
        throw new Error("رصيدك غير كافٍ لوضع هذه المزايدة");
      }

      // 5. Refund Previous Bidder (if exists)
      if (auction.highestBidderId && auction.highestBid) {
        await tx.user.update({
          where: { id: auction.highestBidderId },
          data: { balance: { increment: auction.highestBid } }
        });
        
        // Notify them
        await tx.notification.create({
            data: {
                userId: auction.highestBidderId,
                title: '↩️ استرداد مزايدة',
                message: `تمت المزايدة عليك في مزاد "${auction.title}". تم إعادة مبلغ ${auction.highestBid} ر.س لرصيدك.`
            }
        });
      }

      // 6. Deduct New Bidder
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: Number(bidAmount) } }
      });

      // 7. Update Auction
      const updatedAuction = await (tx.gameDrop as any).update({
        where: { id: auctionId },
        data: {
          highestBid: Number(bidAmount),
          highestBidderId: user.id
        }
      });

      return updatedAuction;
    });

    return NextResponse.json({ success: true, auction: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error placing bid' }, { status: 400 });
  }
}
