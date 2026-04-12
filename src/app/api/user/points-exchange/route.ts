import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { amount } = await req.json(); // Number of points to exchange
    const pointsToExchange = parseInt(amount);

    if (isNaN(pointsToExchange) || pointsToExchange < 500) {
       return NextResponse.json({ error: 'الحد الأدنى للاستبدال هو 500 نقطة' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user || user.points < pointsToExchange) {
      return NextResponse.json({ error: 'رصيد نقاطك غير كافٍ' }, { status: 400 });
    }

    // Rate: 1 point = 0.00375 currency units (e.g. SAR)
    // 500 points = 1.88 SAR
    const balanceToAdd = pointsToExchange * 0.00375;

    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.userId },
        data: {
          points: { decrement: pointsToExchange },
          balance: { increment: balanceToAdd }
        }
      }),
      prisma.notification.create({
        data: {
          userId: session.userId,
          title: 'تم استبدال نقاطك بنجاح 🪙',
          message: `لقد قمت باستبدال ${pointsToExchange} نقطة بمبلغ ${balanceToAdd.toFixed(2)} ر.س. تمت إضافة المبلغ لرصيدك.`
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      newPoints: result[0].points,
      newBalance: result[0].balance 
    });

  } catch (error) {
    console.error('Points Exchange Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء عملية الاستبدال' }, { status: 500 });
  }
}
