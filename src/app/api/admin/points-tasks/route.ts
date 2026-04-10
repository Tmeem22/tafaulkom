import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.videoTask.findMany({
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(tasks);
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { taskId, action } = await req.json(); // action: 'APPROVE' or 'REJECT'
    
    const task = await prisma.videoTask.findUnique({ where: { id: taskId } });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    if (task.status !== 'PENDING') return NextResponse.json({ error: 'Task already processed' }, { status: 400 });

    if (action === 'APPROVE') {
      await prisma.$transaction([
        prisma.videoTask.update({
          where: { id: taskId },
          data: { status: 'APPROVED' }
        }),
        prisma.user.update({
          where: { id: task.userId },
          data: { points: { increment: task.points } }
        }),
        prisma.notification.create({
          data: {
            userId: task.userId,
            title: 'مبروك! تم منحك نقاط 🪙',
            message: `تم قبول فيديو الإعلان الخاص بك ومنحك ${task.points} نقطة بنجاح!`
          }
        })
      ]);
    } else {
      await prisma.videoTask.update({
        where: { id: taskId },
        data: { status: 'REJECTED' }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
