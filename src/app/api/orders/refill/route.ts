import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, confirmStatement } = await request.json();

    if (!confirmStatement) {
      return NextResponse.json({ error: 'يجب تأكيد صدق الطلب' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) }
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'طلب غير موجود' }, { status: 404 });
    }

    // Check 48 hours rule
    const now = new Date();
    const orderDate = new Date(order.createdAt);
    const diffHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 48) {
      return NextResponse.json({ error: 'يجب مرور 48 ساعة على الأقل لطلب التعويض' }, { status: 400 });
    }

    if (order.refillRequested) {
      return NextResponse.json({ error: 'تم تقديم طلب تعويض لهذا الطلب مسبقاً' }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        refillRequested: true,
        refillStatus: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, message: 'تم إرسال طلب التعويض للمراجعة' });
  } catch (error) {
    console.error("Refill Request Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
