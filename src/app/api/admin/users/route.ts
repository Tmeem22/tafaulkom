import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getUserFromSession();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        balance: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users });
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
    const { userId, action, amount, newRole } = data;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (action === 'add_balance') {
      if (!amount || isNaN(Number(amount))) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: Number(amount) } },
        select: { id: true, balance: true }
      });
      return NextResponse.json({ success: true, user });
    } 
    
    if (action === 'set_balance') {
      if (amount === undefined || isNaN(Number(amount))) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: { balance: Number(amount) },
        select: { id: true, balance: true }
      });
      return NextResponse.json({ success: true, user });
    }

    if (action === 'change_role') {
      if (newRole !== 'ADMIN' && newRole !== 'USER') return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: { id: true, role: true }
      });
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
