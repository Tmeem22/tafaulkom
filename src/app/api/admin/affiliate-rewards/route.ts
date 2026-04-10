import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// GET - Admin: Get top 5 affiliates for current month (for rewarding)
export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get top 5 affiliates this month
    const topCommissions = await prisma.referral.groupBy({
      by: ['referrerId'],
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { commission: true },
      _count: { id: true },
      orderBy: { _sum: { commission: 'desc' } },
      take: 5
    });

    const ids = topCommissions.map(c => c.referrerId);
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, username: true, email: true, balance: true, totalCommission: true }
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    // Get referral counts
    const refCounts = await prisma.user.groupBy({
      by: ['referredById'],
      where: { referredById: { in: ids } },
      _count: { id: true }
    });
    const refCountMap = new Map(refCounts.map(r => [r.referredById, r._count.id]));

    const prizes = [25, 15, 10, 5, 3];
    const titles = ['🥇 البطل', '🥈 النجم', '🥉 المتألق', '🏅 المتميز', '⭐ الواعد'];

    const top5 = topCommissions.map((c, i) => {
      const u = userMap.get(c.referrerId);
      return {
        rank: i + 1,
        userId: c.referrerId,
        username: u?.username || 'مستخدم',
        email: u?.email || '',
        monthlyCommission: c._sum.commission || 0,
        monthlyOrders: c._count.id,
        totalReferrals: refCountMap.get(c.referrerId) || 0,
        currentBalance: u?.balance || 0,
        prize: prizes[i] || 0,
        title: titles[i] || '',
        rewarded: false
      };
    });

    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    return NextResponse.json({
      month: monthNames[now.getMonth()],
      year: now.getFullYear(),
      top5
    });
  } catch (error) {
    console.error('Admin Leaderboard Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Admin: Reward a top affiliate with bonus balance
export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, amount, rank } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    const titles = ['البطل 🥇', 'النجم 🥈', 'المتألق 🥉', 'المتميز 🏅', 'الواعد ⭐'];
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const now = new Date();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } }
      }),
      prisma.notification.create({
        data: {
          userId,
          title: `🏆 مبروك! فزت بمسابقة شهر ${monthNames[now.getMonth()]}!`,
          message: `تهانينا! لقد حصلت على المركز ${rank} بلقب "${titles[(rank || 1) - 1]}" في مسابقة أفضل مسوّق بالعمولة لشهر ${monthNames[now.getMonth()]} ${now.getFullYear()}! تمت إضافة $${amount} كمكافأة إلى رصيدك. واصل إنجازاتك المذهلة! 🚀💰`
        }
      })
    ]);

    return NextResponse.json({ success: true, message: `تم تحويل $${amount} للمستخدم بنجاح` });
  } catch (error) {
    console.error('Admin Reward Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
