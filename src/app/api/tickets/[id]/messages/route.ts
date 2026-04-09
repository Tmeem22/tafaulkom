import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// This API uses the existing Ticket.message field to store the conversation thread
// to bypass database migration issues that are causing 500 errors.
// Format: Original Message [MSG_ADMIN]Reply 1 [MSG_USER]Reply 2

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ticketId = Number(id);
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    if (ticket.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const fullText = ticket.message || '';
    const regex = /\[MSG_(ADMIN|USER)\]/g;
    const rawParts = fullText.split(regex);
    // [0] = Original message
    // [1] = Role (ADMIN/USER), [2] = Message text...
    
    let thread = [];
    if (rawParts.length > 1) {
       for (let i = 1; i < rawParts.length; i += 2) {
          const role = rawParts[i];
          const msgContent = rawParts[i+1];
          if (role && msgContent) {
            thread.push({
              id: i, // local id
              role: role,
              message: msgContent.trim(),
              createdAt: ticket.updatedAt || ticket.createdAt
            });
          }
       }
    }

    return NextResponse.json({ messages: thread });
  } catch (err) {
    console.error('Chat GET Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ticketId = Number(id);
    const { message: replyText } = await req.json();

    if (!replyText) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    // Append to existing message
    const updatedMessageContent = `${ticket.message}\n[MSG_${user.role}]${replyText}`;

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        message: updatedMessageContent,
        updatedAt: new Date(),
        status: user.role === 'ADMIN' ? 'open' : ticket.status // Admin reply keeps it open or similar
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Chat POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
