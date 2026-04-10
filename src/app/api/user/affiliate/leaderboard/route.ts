import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// GET - Get leaderboard data
export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get current month boundaries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Monthly top affiliates (by commission earned THIS month)
    const monthlyCommissions = await prisma.referral.groupBy({
      by: ['referrerId'],
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { commission: true },
      _count: { id: true },
      orderBy: { _sum: { commission: 'desc' } },
      take: 20
    });

    // Get user details for top affiliates
    const topAffiliateIds = monthlyCommissions.map(c => c.referrerId);
    const affiliateUsers = await prisma.user.findMany({
      where: { id: { in: topAffiliateIds } },
      select: { id: true, username: true, createdAt: true }
    });

    const userMap = new Map(affiliateUsers.map(u => [u.id, u]));

    // Also get total referral counts for each
    const referralCounts = await prisma.user.groupBy({
      by: ['referredById'],
      where: { referredById: { in: topAffiliateIds } },
      _count: { id: true }
    });
    const refCountMap = new Map(referralCounts.map(r => [r.referredById, r._count.id]));

    const leaderboard = monthlyCommissions.map((c, index) => {
      const u = userMap.get(c.referrerId);
      return {
        rank: index + 1,
        username: u ? (u.username.substring(0, 3) + '***' + u.username.slice(-1)) : '***',
        monthlyCommission: c._sum.commission || 0,
        monthlyOrders: c._count.id,
        totalReferrals: refCountMap.get(c.referrerId) || 0,
        isCurrentUser: c.referrerId === user.id
      };
    });

    // All-time top 10
    const allTimeCommissions = await prisma.referral.groupBy({
      by: ['referrerId'],
      _sum: { commission: true },
      _count: { id: true },
      orderBy: { _sum: { commission: 'desc' } },
      take: 10
    });

    const allTimeIds = allTimeCommissions.map(c => c.referrerId);
    const allTimeUsers = await prisma.user.findMany({
      where: { id: { in: allTimeIds } },
      select: { id: true, username: true }
    });
    const allTimeUserMap = new Map(allTimeUsers.map(u => [u.id, u]));

    const allTimeLeaderboard = allTimeCommissions.map((c, index) => {
      const u = allTimeUserMap.get(c.referrerId);
      return {
        rank: index + 1,
        username: u ? (u.username.substring(0, 3) + '***' + u.username.slice(-1)) : '***',
        totalCommission: c._sum.commission || 0,
        totalOrders: c._count.id,
        isCurrentUser: c.referrerId === user.id
      };
    });

    // Current user's rank
    const userMonthlyRank = leaderboard.findIndex(l => l.isCurrentUser) + 1;
    const userMonthlyCommission = await prisma.referral.aggregate({
      where: {
        referrerId: user.id,
        createdAt: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { commission: true },
      _count: { id: true }
    });

    // Days remaining
    const daysRemaining = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Month name in Arabic
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    return NextResponse.json({
      currentMonth: monthNames[now.getMonth()],
      currentYear: now.getFullYear(),
      daysRemaining,
      userRank: userMonthlyRank || 'غير مصنّف',
      userMonthlyCommission: userMonthlyCommission._sum.commission || 0,
      userMonthlyOrders: userMonthlyCommission._count.id,
      monthly: leaderboard,
      allTime: allTimeLeaderboard,
      prizes: [
        { rank: 1, prize: '25$', emoji: '🥇', title: 'البطل', color: 'from-amber-400 to-yellow-500' },
        { rank: 2, prize: '15$', emoji: '🥈', title: 'النجم', color: 'from-slate-300 to-slate-400' },
        { rank: 3, prize: '10$', emoji: '🥉', title: 'المتألق', color: 'from-amber-600 to-amber-700' },
        { rank: 4, prize: '5$', emoji: '🏅', title: 'المتميز', color: 'from-blue-400 to-blue-500' },
        { rank: 5, prize: '3$', emoji: '⭐', title: 'الواعد', color: 'from-purple-400 to-purple-500' },
      ]
    });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
