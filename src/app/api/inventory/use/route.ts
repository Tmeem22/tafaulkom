import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';
import { createProviderOrder, getProviderBalance } from '@/lib/smm-api';

export async function POST(req: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { itemId, link } = await req.json();
    if (!itemId || !link) {
      return NextResponse.json({ error: 'يرجى إدخال الرابط المطلوب' }, { status: 400 });
    }

    // 1. Find the item
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId }
    });

    if (!item || item.userId !== user.id || item.isUsed) {
      return NextResponse.json({ error: 'الجائزة غير صالحة أو تم استخدامها بالفعل' }, { status: 400 });
    }

    if (!item.serviceId || !item.quantity) {
      return NextResponse.json({ error: 'هذه الجائزة غير مرتبطة بخدمة SMM تلقائية، يرجى التواصل مع الدعم' }, { status: 400 });
    }

    // 2. Check Provider Balance (Fouladhi check)
    const providerBalance = await getProviderBalance();
    // Assuming we need at least $0.50 as a safety cushion for orders
    if (providerBalance.error || Number(providerBalance.balance) < 0.1) {
       console.error("[Inventory Use] Provider Balance low or error:", providerBalance);
       return NextResponse.json({ error: 'عذراً، نظام الجوائز قيد الصيانة المؤقتة (تحديث السيرفرات).' }, { status: 400 });
    }

    // 3. Place order to Provider
    const providerResponse = await createProviderOrder(item.serviceId, link, item.quantity);

    if (providerResponse.error) {
      return NextResponse.json({ error: `فشل تنفيذ الطلب: ${providerResponse.error}` }, { status: 400 });
    }

    const providerOrderId = providerResponse.order ? String(providerResponse.order) : null;
    if (!providerOrderId) {
      return NextResponse.json({ error: 'فشل في الحصول على تأكيد من المزود' }, { status: 400 });
    }

    // 4. Update Database
    await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: itemId },
        data: { isUsed: true }
      }),
      prisma.order.create({
        data: {
          userId: user.id,
          providerOrderId: providerOrderId,
          service: `[جائزة] ${item.name}`,
          link: link,
          quantity: item.quantity,
          charge: 0, // It's a prize
          remains: item.quantity,
          status: 'pending'
        }
      })
    ]);

    return NextResponse.json({ success: true, message: 'تم البدء في تنفيذ جائزتك بنجاح! راقب قسم طلباتي.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
