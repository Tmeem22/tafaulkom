import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Admin Point Management: Add/Remove points or change status
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, pointsAction, amount, taskId, taskAction } = await req.json();

    // 1. Manual User point modification
    if (userId && pointsAction && amount !== undefined) {
       const user = await prisma.user.update({
         where: { id: userId },
         data: {
           points: pointsAction === 'ADD' ? { increment: amount } : { decrement: Math.min(amount) }
         }
       });

       await prisma.notification.create({
         data: {
           userId: userId,
           title: 'تم تحديث نقاطك من قبل الإدارة 🛡️',
           message: `لقد تم ${pointsAction === 'ADD' ? 'إضافة' : 'سحب'} ${amount} نقطة من حسابك.`
         }
       });

       return NextResponse.json({ success: true, newPoints: user.points });
    }

    // 2. Search users (convenience)
    if (req.method === 'GET') {
       // Handled by separate function or GET below
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });

  } catch (error) {
    console.error('Admin Points Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (username) {
    const users = await prisma.user.findMany({
      where: {
        username: { contains: username, mode: 'insensitive' }
      },
      select: {
        id: true,
        username: true,
        points: true,
        balance: true
      },
      take: 10
    });
    return NextResponse.json(users);
  }

  return NextResponse.json({ error: 'Username required' }, { status: 400 });
}
