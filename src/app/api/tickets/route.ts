import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tickets = await prisma.ticket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ tickets });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { subject, message, orderId } = data;

    if (!subject || !message) {
      return NextResponse.json({ error: 'الرجاء إدخال جميع الحقول' }, { status: 400 });
    }

    let finalMessage = message;

    // Order Verification Logic! 🕵️‍♂️ (The truth seeker)
    if (orderId && String(orderId).trim() !== '') {
      const numericOrderId = Number(orderId);
      
      if (isNaN(numericOrderId)) {
        return NextResponse.json({ error: 'رقم الطلب غير صالح' }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { id: numericOrderId }
      });

      // 1. Check if order exists and belongs to the user
      if (!order || order.userId !== user.id) {
        return NextResponse.json({ error: 'رقم الطلب غير صحيح، لم تقم بهذا الطلب! يرجى إدخال رقم طلب حقيقي لك.' }, { status: 400 });
      }

      // 2. Check logic based on request
      if (subject.includes('تعويض') || subject.includes('Refill')) {
        if (order.status === 'pending' || order.status === 'processing') {
          return NextResponse.json({ error: 'لا يمكنك طلب تعويض لأن الطلب لا يزال قيد التنفيذ.' }, { status: 400 });
        }
      }

      finalMessage = `[بخصوص طلب رقم #${orderId}]\n${message}`;
    }

    const newTicket = await prisma.ticket.create({
      data: {
        userId: user.id,
        subject,
        message: finalMessage,
        status: 'open'
      }
    });

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (err) {
    console.error('Ticket error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
