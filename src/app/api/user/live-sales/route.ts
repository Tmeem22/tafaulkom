import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const FAKE_NAMES = ['Ahm***', 'Khali***', 'Abd***', 'Moh***', 'Fah***', 'Sar***', 'Nour***', 'Tal***', 'Yoo***'];
const FAKE_SERVICES = ['1000 متابع انستقرام', '500 لايك تيك توك', 'باقة يوتيوب الماسية', '10000 مشاهدة سناب', '500 ريتويت تويتر'];

export async function GET() {
  try {
    // Fetch last 5 real completed orders from the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const realOrders = await prisma.order.findMany({
      where: {
        status: 'completed',
        createdAt: { gte: yesterday }
      },
      select: {
        id: true,
        service: true,
        user: { select: { username: true } },
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const formattedRealOrders = realOrders.map(o => ({
      id: o.id.toString(),
      name: o.user.username.substring(0, 3) + '***',
      service: `باقة ${o.service.substring(0, 20)}...`,
      timeAgo: Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000), // in minutes
      isReal: true
    }));

    // If we have less than 5 real orders, fill the rest with fake (hybrid)
    let finalSales = [...formattedRealOrders];
    let fakeMinutes = 2;
    
    while (finalSales.length < 10) {
      finalSales.push({
        id: `fake-${Math.random()}`,
        name: FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)],
        service: FAKE_SERVICES[Math.floor(Math.random() * FAKE_SERVICES.length)],
        timeAgo: fakeMinutes,
        isReal: false
      });
      fakeMinutes += Math.floor(Math.random() * 15) + 3; // add 3-17 mins
    }

    // Sort by timeAgo ASC so it looks realistic (newest first)
    finalSales.sort((a, b) => a.timeAgo - b.timeAgo);

    return NextResponse.json(finalSales);

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
