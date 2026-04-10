import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// POST - User: Validate & apply coupon
export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, orderAmount } = await req.json();
    if (!code) return NextResponse.json({ error: 'أدخل كود الخصم' }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: 'كود الخصم غير صالح أو غير نشط' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: 'كود الخصم منتهي الصلاحية' }, { status: 400 });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'تم استخدام هذا الكود الحد الأقصى من المرات' }, { status: 400 });
    }

    if (orderAmount && orderAmount < coupon.minOrder) {
      return NextResponse.json({ error: `الحد الأدنى للطلب ${coupon.minOrder} ريال` }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount || 0) * (coupon.discountValue / 100);
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.min(discount, orderAmount || 999),
      message: coupon.discountType === 'percentage' 
        ? `خصم ${coupon.discountValue}% مطبّق!` 
        : `خصم $${coupon.discountValue} مطبّق!`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
