import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tasks = await prisma.videoTask.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { videoUrl } = await req.json();
    if (!videoUrl) return NextResponse.json({ error: 'الرجاء إدخال رابط الفيديو' }, { status: 400 });

    // Limit check: 2 videos every 2 weeks
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const recentCount = await prisma.videoTask.count({
      where: {
        userId: session.userId,
        createdAt: { gte: twoWeeksAgo }
      }
    });

    if (recentCount >= 2) {
      return NextResponse.json({ 
        error: 'عذراً، يمكنك إرسال فيديوهين فقط كل أسبوعين. يرجى الانتظار قليلاً.' 
      }, { status: 400 });
    }

    const task = await prisma.videoTask.create({
      data: {
        userId: session.userId,
        videoUrl,
        status: 'PENDING'
      }
    });

    // Automatically create a support ticket too as requested
    await prisma.ticket.create({
      data: {
        userId: session.userId,
        subject: 'طلب نقاط - فيديو إعلاني',
        message: `مرحباً، لقد قمت بنشر فيديو إعلاني للموقع: ${videoUrl}\nبانتظار المراجعة لمنحي 250 نقطة.`,
        status: 'open'
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
