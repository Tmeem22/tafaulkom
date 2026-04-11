import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { itemId, link } = await req.json();

    if (!itemId || !link) return NextResponse.json({ error: 'الرابط مطلوب لتنفيذ الجائزة' }, { status: 400 });

    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId }
    });

    if (!item || item.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (item.isUsed) {
      return NextResponse.json({ error: 'هذه الجائزة تم استخدامها مسبقاً' }, { status: 400 });
    }

    // 1. Check if it's an automated service prize
    if (item.serviceId && item.quantity) {
       const SMM_API_URL = process.env.SMM_API_URL || "https://smmcpan.com/api/v2";
       const SMM_API_KEY = process.env.SMM_API_KEY;

       if (!SMM_API_KEY) {
          throw new Error("نظام الطلب التلقائي غير مهيأ حالياً (نقص في المفتاح). يرجى التواصل مع الإدارة.");
       }

       // Call SMMCPan API to add order
       const params = new URLSearchParams();
       params.append('key', SMM_API_KEY);
       params.append('action', 'add');
       params.append('service', item.serviceId.toString());
       params.append('link', link);
       params.append('quantity', item.quantity.toString());

       const providerRes = await fetch(SMM_API_URL, {
          method: 'POST',
          body: params
       });

       const providerData = await providerRes.json();

       if (providerData.error) {
          return NextResponse.json({ error: `فشل إرسال الطلب للمزود: ${providerData.error}` }, { status: 400 });
       }

       if (providerData.order) {
          // 2. Create local order record for tracking
          await prisma.order.create({
             data: {
                userId: user.id,
                providerOrderId: providerData.order.toString(),
                service: `[جائزة] ${item.name}`,
                link: link,
                quantity: item.quantity,
                charge: 0, // Prize is free
                remains: item.quantity,
                status: 'pending'
             }
          });
       }
    }

    // 3. Mark item as used
    const updated = await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        isUsed: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "تم قبول طلبك وتنفيذه تلقائياً! يمكنك متابعة حالة الطلب والتقدم في صفحة 'طلباتي'.",
      item: updated 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
