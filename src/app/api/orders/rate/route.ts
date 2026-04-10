import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Triggering re-scan after schema update
import { getUserFromSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, rating, review } = await request.json();

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    // Find the order and ensure it belongs to the user and is completed
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'completed') {
      return NextResponse.json({ error: 'يمكنك التقييم فقط بعد اكتمال الطلب' }, { status: 400 });
    }

    // Update the order with rating and review
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        rating: Number(rating),
        review: review || null,
      },
    });

    // Auto-create Testimonial for 4-5 star positive reviews
    if (rating >= 4 && review && review.length > 10) {
      await prisma.testimonial.create({
        data: {
          name: user.username.substring(0, 3) + '***',
          text: review,
          rating: Number(rating),
        }
      });
    }

    // Award 10 bonus points for reviewing
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: 10 } } as any
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'شكراً لتقييمك! ⭐',
          message: `تم إضافة 10 نقاط مكافأة لحسابك كشكر على تقييمك.`
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'شكراً لتقييمك! حصلت على 10 نقاط مكافأة ⭐',
      order: updatedOrder 
    });

  } catch (error) {
    console.error("Order Rating Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
