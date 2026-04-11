import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

const BUNDLE_PRICE = 40.0; // 40 SAR for 5 boxes (Save 10 SAR)
const BUNDLE_SIZE = 5;

const PRIZE_POOL = [
  { name: 'الجائزة الكبرى الماسية 💎', description: 'رصيد 200 ر.س فوري!', chance: 0.001, type: 'BALANCE', value: 200.0 },
  { name: 'باقة الذهب 🌟', description: 'رصيد 100 ر.س كاش!', chance: 0.002, type: 'BALANCE', value: 100.0 },
  { name: 'رصيد ملكي 👑', description: 'رصيد 50 ر.س لمحفظتك', chance: 0.01, type: 'BALANCE', value: 50.0 },
  { name: 'هدايا تفاعلكم 🎁', description: 'رصيد 20 ر.س', chance: 0.05, type: 'BALANCE', value: 20.0 },
  { name: '100,000 مشاهدة تيك توك 🔥', description: 'صاروخ ترند لتيك توك!', chance: 0.01, type: 'SERVICE', value: 0, serviceId: 3415, quantity: 100000 },
  { name: '50,000 متابع إنستغرام VIP ⭐️', description: 'ارفع هيبتك واطلبهم عبر الدعم', chance: 0.01, type: 'SERVICE', value: 0, serviceId: 4432, quantity: 50000 },
  { name: 'رصيد استرداد 💰', description: 'استرديت 9.5 ر.س من قيمة الصندوق', chance: 0.40, type: 'BALANCE', value: 9.5 },
  { name: 'تعادل الصندوق ⚖️', description: 'ربحت 10 ر.س (استرددت مالك بالكامل)', chance: 0.20, type: 'BALANCE', value: 10.0 },
  { name: '10,000 مشاهدة تيك توك 🚀', description: 'رابط المقطع لتنفيذ الهدية', chance: 0.10, type: 'SERVICE', value: 0, serviceId: 3415, quantity: 10000 },
  { name: '5,000 لايك إنستغرام ❤️', description: 'رابط الصور لتنفيذ الهدية', chance: 0.10, type: 'SERVICE', value: 0, serviceId: 3912, quantity: 5000 },
  { name: 'باقة الستوري 👁️', description: '10,000 مشاهدة لستوري الإنستقرام', chance: 0.117, type: 'SERVICE', value: 0, serviceId: 4120, quantity: 10000 },
];

function getRandomPrize() {
  const rand = Math.random();
  let cumulative = 0;
  for (const prize of PRIZE_POOL) {
    cumulative += prize.chance;
    if (rand <= cumulative) return prize;
  }
  return PRIZE_POOL[0];
}

export async function POST() {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const results = await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.findUnique({ where: { id: user.id } });
      if (!dbUser || dbUser.balance < BUNDLE_PRICE) throw new Error(`رصيدك غير كافٍ، سعر باقة التوفير ${BUNDLE_PRICE} ر.س`);

      // Deduct Bundle Price
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: BUNDLE_PRICE } }
      });

      const prizesToGrant = [];
      for (let i = 0; i < BUNDLE_SIZE; i++) {
        const prize = getRandomPrize();
        prizesToGrant.push(prize);
        
        // If balance prize, add it immediately
        if (prize.type === 'BALANCE') {
            await tx.user.update({
                where: { id: user.id },
                data: { balance: { increment: prize.value } }
            });
        }

        // Add to inventory (Using dynamic casting to avoid crash if DB columns are missing)
        await (tx.inventoryItem as any).create({
            data: {
                userId: user.id,
                name: prize.name,
                description: `${prize.description}${prize.serviceId ? ` [Service:${prize.serviceId}|Qty:${prize.quantity}]` : ''}`,
                type: 'MYSTERY_BOX'
            }
        });
      }

      return prizesToGrant;
    });

    return NextResponse.json({ success: true, prizes: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
