import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { method, amount, receiptImage } = data;

    if (!amount || !receiptImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDeposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        method: method || 'Bank Transfer',
        amount: parseFloat(amount),
        receiptImage: receiptImage,
        status: 'pending'
      }
    });

    return NextResponse.json({ success: true, deposit: newDeposit });
  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deposits = await prisma.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ deposits });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
