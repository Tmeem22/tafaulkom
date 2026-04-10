import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// GET: Fetch notifications for the current user
export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Send a notification
export async function POST(req: Request) {
  try {
    const { userId, title, message } = await req.json();
    const user = await getUserFromSession();
    
    if (!user || (user.role !== 'ADMIN' && user.id !== userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Anti-Spam: Check if a notification with this title/message already exists for this user
    const existing = await prisma.notification.findFirst({
      where: { userId, title, message }
    });
    if (existing) {
      return NextResponse.json(existing); // Return existing instead of creating duplicate
    }

    const notification = await prisma.notification.create({
      data: { userId, title, message },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove a notification or all notifications
export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id } = body;
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (id) {
      // Delete specific
      await prisma.notification.delete({
        where: { id, userId: user.id }
      });
    } else {
      // Bulk Delete (Delete All for user)
      await prisma.notification.deleteMany({
        where: { userId: user.id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
