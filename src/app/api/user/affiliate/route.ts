import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';
import { nanoid } from 'nanoid';

// GET - Get user's affiliate data
export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Generate referral code if not exists
    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = `TF-${nanoid(8).toUpperCase()}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { referralCode }
      });
    }

    // Count referrals and total commission
    const referrals = await prisma.user.findMany({
      where: { referredById: user.id },
      select: { id: true, username: true, createdAt: true }
    });

    const commissions = await prisma.referral.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        referred: { select: { username: true } }
      }
    });

    const totalCommission = await prisma.referral.aggregate({
      where: { referrerId: user.id },
      _sum: { commission: true }
    });

    return NextResponse.json({
      referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_URL || 'https://smm-panel-olive.vercel.app'}/register?ref=${referralCode}`,
      totalReferrals: referrals.length,
      totalCommission: totalCommission._sum.commission || 0,
      currentBalance: user.totalCommission || 0,
      referrals: referrals.map(r => ({
        username: r.username.substring(0, 3) + '***',
        joinedAt: r.createdAt
      })),
      recentCommissions: commissions.map(c => ({
        amount: c.commission,
        orderAmount: c.orderAmount,
        from: c.referred.username.substring(0, 3) + '***',
        date: c.createdAt
      }))
    });
  } catch (error) {
    console.error('Affiliate API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Withdraw affiliate commission to main balance
export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (user.totalCommission < 1) {
      return NextResponse.json({ error: 'الحد الأدنى للسحب هو 1$' }, { status: 400 });
    }

    const amount = user.totalCommission;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: amount },
          totalCommission: 0
        }
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'تحويل أرباح العمولة 💸',
          message: `تم تحويل ${amount.toFixed(4)}$ من أرباح التسويق بالعمولة إلى رصيدك الأساسي.`
        }
      })
    ]);

    return NextResponse.json({ success: true, transferred: amount });
  } catch (error) {
    console.error('Affiliate Withdraw Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
