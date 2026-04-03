import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getUserFromSession();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
      include: {
        user: { select: { username: true, email: true } }
      },
      orderBy: [
        { status: 'asc' }, // open first
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ tickets });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getUserFromSession();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { id, action } = data; // action can be 'close' or 'reply'

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (action === 'close') {
      const ticket = await prisma.ticket.update({
        where: { id: Number(id) },
        data: { status: 'closed' }
      });
      return NextResponse.json({ success: true, ticket });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating ticket', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
