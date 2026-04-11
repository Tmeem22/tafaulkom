import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  const admin = await getUserFromSession();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tasks = await prisma.videoTask.findMany({
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tasks);
}

export async function PATCH(req: Request) {
  const admin = await getUserFromSession();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { taskId, action } = await req.json();

    if (!taskId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const task = await prisma.videoTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    if (task.status !== 'PENDING') {
      return NextResponse.json({ error: 'تمت معالجة هذا الطلب مسبقاً' }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await prisma.$transaction(async (tx) => {
      // Update Task status
      await tx.videoTask.update({
        where: { id: taskId },
        data: { status: newStatus }
      });

      if (newStatus === 'APPROVED') {
        // Give points to user
        await tx.user.update({
          where: { id: task.userId },
          data: { points: { increment: task.points } }
        });
        
        // Notify user
        await tx.notification.create({
          data: {
            userId: task.userId,
            title: 'تم قبول طلب الفيديو',
            message: `تم قبول الفيديو الخاص بك وإضافة ${task.points} نقطة مكافأة إلى رصيدك! بمجرد وصول نقاطك لـ 500 يمكنك استبدالها برصيد مالي.`
          }
        });
      } else {
        // Notify user about rejection
        await tx.notification.create({
          data: {
            userId: task.userId,
            title: 'تم رفض طلب الفيديو',
            message: `عذراً، لم يطابق الفيديو الشروط المطلوبة. لم يتمكن المطوّر من الموافقة عليه، يمكنك المحاولة مرة أخرى بفيديو جديد.`
          }
        });
      }
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
