import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Get manually added testimonials (if any)
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // 2. Get real order reviews
    const orderReviews = await prisma.order.findMany({
      where: {
        rating: { not: null },
      },
      include: {
        user: {
          select: { username: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    // 3. Combine and format
    const formattedOrderReviews = orderReviews.map(o => ({
      id: `order-${o.id}`,
      name: o.user.username,
      text: o.review || 'خدمة ممتازة وسريعة!',
      rating: o.rating,
      createdAt: o.updatedAt,
    }));

    const allReviews = [...formattedOrderReviews, ...testimonials].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allReviews.slice(0, 15));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json([], { status: 500 });
  }
}
