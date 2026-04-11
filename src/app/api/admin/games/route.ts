import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function POST(req: Request) {
  const admin = await getUserFromSession();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();

    // Check if there's already an active or waiting drop
    const active = await prisma.gameDrop.findFirst({
        where: { status: { in: ['WAITING', 'ACTIVE'] } }
    });
    if (active) {
        return NextResponse.json({ error: 'يوجد مزاد قيد الانتظار أو نشط حالياً، الرجاء الانتظار حتى ينتهي' }, { status: 400 });
    }

    const startTime = new Date(data.startTime);
    let endTime = null;

    if (data.type === 'STANDARD_AUCTION') {
        // Standard auction lasts for X minutes after it starts
        endTime = new Date(startTime.getTime() + (Number(data.durationMinutes || 60) * 60000));
    }

    // cast to any to handle schema updates that haven't been regenerated in TS types yet
    const drop = await (prisma.gameDrop as any).create({
      data: {
        type: data.type || 'REVERSE_AUCTION',
        title: data.title,
        prizeDescription: data.prizeDescription,
        startPrice: Number(data.startPrice),
        currentPrice: Number(data.startPrice),
        minPrice: Number(data.minPrice || 0),
        dropAmount: Number(data.dropAmount || 0),
        dropIntervalSeconds: Number(data.dropIntervalSeconds || 0),
        serviceId: data.serviceId ? Number(data.serviceId) : null,
        quantity: data.quantity ? Number(data.quantity) : null,
        startTime: startTime,
        endTime: endTime,
        highestBid: data.type === 'STANDARD_AUCTION' ? Number(data.startPrice) : 0,
        status: 'WAITING'
      }
    });

    return NextResponse.json({ success: true, drop });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
