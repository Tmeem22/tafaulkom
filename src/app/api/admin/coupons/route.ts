import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// GET - Admin: List all coupons
export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Admin: Create a new coupon
export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, discountType, discountValue, minOrder, maxUses, expiresAt } = await req.json();

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'الكود والقيمة مطلوبان' }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) return NextResponse.json({ error: 'هذا الكود مستخدم بالفعل' }, { status: 400 });

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType: discountType || 'percentage',
        discountValue: Number(discountValue),
        minOrder: Number(minOrder) || 0,
        maxUses: Number(maxUses) || 100,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - Admin: Delete a coupon
export async function DELETE(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
