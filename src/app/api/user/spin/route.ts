import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

const PRIZES = [
  { name: 'خصم 10%', type: 'discount', value: 10, weight: 25, color: '#6c3ce1', emoji: '🎫' },
  { name: 'خصم 20%', type: 'discount', value: 20, weight: 12, color: '#f59e0b', emoji: '🔥' },
  { name: 'خصم 50%', type: 'discount', value: 50, weight: 3, color: '#ef4444', emoji: '💎' },
  { name: '25 نقطة', type: 'points', value: 25, weight: 20, color: '#10b981', emoji: '🪙' },
  { name: '50 نقطة', type: 'points', value: 50, weight: 10, color: '#3b82f6', emoji: '💰' },
  { name: '100 نقطة', type: 'points', value: 100, weight: 5, color: '#8b5cf6', emoji: '👑' },
  { name: '$0.25 رصيد', type: 'balance', value: 0.25, weight: 8, color: '#14b8a6', emoji: '💵' },
  { name: 'حظ أوفر!', type: 'none', value: 0, weight: 17, color: '#6b7280', emoji: '😅' },
];

function weightedRandom() {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < PRIZES.length; i++) {
    random -= PRIZES[i].weight;
    if (random <= 0) return i;
  }
  return PRIZES.length - 1;
}

// GET - Check if user can spin today & get prizes list
export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySpin = await prisma.spinResult.findFirst({
      where: {
        userId: user.id,
        createdAt: { gte: today, lt: tomorrow }
      }
    });

    return NextResponse.json({
      canSpin: !todaySpin,
      lastPrize: todaySpin ? { name: todaySpin.prize, value: todaySpin.value } : null,
      prizes: PRIZES.map(p => ({ name: p.name, color: p.color, emoji: p.emoji }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Spin the wheel
export async function POST() {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySpin = await prisma.spinResult.findFirst({
      where: { userId: user.id, createdAt: { gte: today, lt: tomorrow } }
    });

    if (todaySpin) {
      return NextResponse.json({ error: 'لقد لعبت اليوم بالفعل! عد غداً 🎰' }, { status: 400 });
    }

    const prizeIndex = weightedRandom();
    const prize = PRIZES[prizeIndex];

    // Apply prize
    const operations: any[] = [
      prisma.spinResult.create({
        data: { userId: user.id, prize: prize.name, value: prize.value }
      })
    ];

    if (prize.type === 'points') {
      operations.push(prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: prize.value } }
      }));
    } else if (prize.type === 'balance') {
      operations.push(prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: prize.value } }
      }));
    }

    if (prize.type !== 'none') {
      operations.push(prisma.notification.create({
        data: {
          userId: user.id,
          title: `🎰 فزت في عجلة الحظ!`,
          message: prize.type === 'discount' 
            ? `مبروك! حصلت على كوبون خصم ${prize.value}%! استخدمه في طلبك القادم. الكود: SPIN${prize.value}`
            : prize.type === 'points'
            ? `مبروك! تم إضافة ${prize.value} نقطة لحسابك!`
            : `مبروك! تم إضافة $${prize.value} لرصيدك!`
        }
      }));
    }

    await prisma.$transaction(operations);

    // Auto-create discount coupon if prize is a discount
    if (prize.type === 'discount') {
      const couponCode = `SPIN${prize.value}-${Date.now().toString(36).toUpperCase()}`;
      await prisma.coupon.create({
        data: {
          code: couponCode,
          discountType: 'percentage',
          discountValue: prize.value,
          maxUses: 1,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });
      return NextResponse.json({ prizeIndex, prize: { ...prize, couponCode } });
    }

    return NextResponse.json({ prizeIndex, prize });
  } catch (error) {
    console.error('Spin Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
