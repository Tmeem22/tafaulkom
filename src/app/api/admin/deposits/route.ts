import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deposits = await prisma.deposit.findMany({
      include: {
        user: {
          select: { username: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ deposits });
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
    const { id, action } = data; // action: 'approve' or 'reject'

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    const depositId = Number(id);

    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true }
    });

    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'Deposit already processed' }, { status: 400 });
    }

    let updatedDeposit;

    if (action === 'approve') {
      // Use transaction to ensure both balance and status update succeed
      await prisma.$transaction(async (tx) => {
        updatedDeposit = await tx.deposit.update({
          where: { id: depositId },
          data: { status: 'completed' }
        });

        await tx.user.update({
          where: { id: deposit.userId },
          data: { balance: deposit.user.balance + deposit.amount }
        });
      });
    } else if (action === 'reject') {
      updatedDeposit = await prisma.deposit.update({
        where: { id: depositId },
        data: { status: 'rejected' }
      });
    }

    return NextResponse.json({ success: true, deposit: updatedDeposit });
  } catch (error) {
    console.error('Error updating deposit', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
