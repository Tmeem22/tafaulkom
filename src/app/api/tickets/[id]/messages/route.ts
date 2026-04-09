import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ticketId = Number(params.id);
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    // Ensure user is owner or admin
    if (ticket.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ messages: ticket.messages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ticketId = Number(params.id);
    const { message } = await req.json();

    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    if (ticket.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (ticket.status === 'closed') {
      return NextResponse.json({ error: 'لا يمكنك الرد على تذكرة مغلقة' }, { status: 400 });
    }

    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: user.id,
        role: user.role,
        message: message
      }
    });

    // Update ticket updatedAt
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
