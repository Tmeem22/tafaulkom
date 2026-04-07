import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const isAuth = await verifyAuth(req);
    if (!isAuth || isAuth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: isNaN(parseInt(search)) ? undefined : parseInt(search) }
      ].filter(Boolean);
    }
    if (category) {
      where.category = category;
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' }
      }),
      prisma.service.count({ where })
    ]);

    const categories = await prisma.service.groupBy({
      by: ['category'],
      _count: true
    });

    return NextResponse.json({
      services,
      total,
      pages: Math.ceil(total / limit),
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error("Admin services fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const isAuth = await verifyAuth(req);
    if (!isAuth || isAuth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, customRate, active } = await req.json();

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        customRate: customRate === null ? null : parseFloat(customRate),
        active: active ?? undefined
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Admin service update error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
