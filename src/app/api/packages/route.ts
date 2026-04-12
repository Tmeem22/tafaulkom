import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderOrder } from '@/lib/smm-api';
import { getUserFromSession } from '@/lib/auth';
import { USD_TO_SAR_RATE } from '@/lib/constants';

// Target definitions for the dynamic packages
const PACKAGE_TEMPLATES = [
  {
    id: 'tiktok_viral',
    name: '🚀 باقة اكتساح التيك توك',
    description: '100 ألف مشاهدة + 5 آلاف لايك + 2000 حفظ + 1000 شير. كل هذا في رابط فيديو واحد!',
    icon: 'https://img.icons8.com/color/256/tiktok.png',
    margin: 15, // Add 15 SAR profit directly
    requires: 'رابط فيديو التيك توك',
    tasks: [
      { nameMatch: 'مشاهدات تيك', qty: 100000, type: 'views' },
      { nameMatch: 'لايكات تيك', qty: 5000, type: 'likes' },
      { nameMatch: 'حفظ تيك', qty: 2000, type: 'saves' },
      { nameMatch: 'حركة الاكسبلور', qty: 1000, type: 'shares' }, // shares/explore
    ]
  },
  {
    id: 'instagram_starter',
    name: '📸 إنطلاقة الإنستقرام',
    description: '50 ألف مشاهدة للريلز + 3 آلاف لايك + 100 تعليق عشوائي لدعم حسابك.',
    icon: 'https://img.icons8.com/fluency/256/instagram-new.png',
    margin: 15,
    requires: 'رابط بوست أو ريلز الإنستقرام',
    tasks: [
      { nameMatch: 'مشاهدات انستقرام', qty: 50000, type: 'views' },
      { nameMatch: 'لايكات انستقرام', qty: 3000, type: 'likes' },
      { nameMatch: 'تعليقات انستقرام', qty: 100, type: 'comments' }
    ]
  },
  {
    id: 'snapchat_star',
    name: '⭐ نجم السناب شات',
    description: '10 آلاف متابع/مشترك + 50 ألف مشاهدة للستوري.',
    icon: 'https://img.icons8.com/color/256/snapchat.png',
    margin: 15,
    requires: 'اسم المستخدم (يوزر السناب)',
    tasks: [
      { nameMatch: 'متابعين سناب', qty: 10000, type: 'followers' },
      { nameMatch: 'مشاهدات سناب', qty: 50000, type: 'views' }
    ]
  }
];

// Helper to calculate runtime packages
async function buildDynamicPackages() {
  const builtPackages = [];
  
  for (const pkg of PACKAGE_TEMPLATES) {
    let totalProviderCostUsd = 0;
    const resolvedServices = [];
    
    for (const task of pkg.tasks) {
      // Find the cheapest active service matching the name
      const bestService = await prisma.service.findFirst({
        where: {
          name: { contains: task.nameMatch }, // simple match (might miss if provider renames)
          active: true
        },
        orderBy: { originalRate: 'asc' }
      });
      
      if (bestService) {
        totalProviderCostUsd += (bestService.originalRate / 1000) * task.qty;
        resolvedServices.push({ srvId: bestService.id, qty: task.qty });
      }
    }
    
    // Convert to SAR
    const totalProviderCostSar = totalProviderCostUsd * USD_TO_SAR_RATE;
    const finalPrice = totalProviderCostSar + pkg.margin; // COST + 15 SAR!
    
    // Only push if at least the core services were found (prevent empty packages)
    if (resolvedServices.length > 0) {
      builtPackages.push({
        ...pkg,
        price: finalPrice,
        providerCost: totalProviderCostSar,
        resolvedServices
      });
    }
  }
  
  return builtPackages;
}

export async function GET() {
  const pkgs = await buildDynamicPackages();
  // Strip resolved service IDs for pure UI consumption
  const safePkgs = pkgs.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    icon: p.icon,
    requires: p.requires,
    price: p.price
  }));
  return NextResponse.json(safePkgs);
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { packageId, link } = await req.json();
    if (!packageId || !link) return NextResponse.json({ error: 'Missing logic' }, { status: 400 });

    const pkgs = await buildDynamicPackages();
    const pkg = pkgs.find(p => p.id === packageId);

    if (!pkg) return NextResponse.json({ error: 'الباقة غير متاحة حالياً' }, { status: 400 });

    // Check Balance
    if (user.balance < pkg.price) {
       return NextResponse.json({ error: 'رصيدك غير كافٍ لشراء هذه الباقة' }, { status: 400 });
    }

    // Process all sub-orders
    let currentUserBalance = user.balance;
    let successfulOrders = 0;

    for (const srv of pkg.resolvedServices) {
       const providerResponse = await createProviderOrder(srv.srvId, link, srv.qty);
       if (!providerResponse.error && providerResponse.order) {
           const dbSrv = await prisma.service.findUnique({ where: { id: srv.srvId } });
           
           await prisma.order.create({
              data: {
                 userId: user.id,
                 providerOrderId: String(providerResponse.order),
                 service: dbSrv?.name || 'Package Inner Service',
                 link: link,
                 quantity: srv.qty,
                 charge: 0, // Recorded as 0 because the main charge is pooled
                 remains: srv.qty,
                 status: 'pending'
              }
           });
           successfulOrders++;
       }
    }

    if (successfulOrders === 0) {
       return NextResponse.json({ error: 'فشل تنفيذ الباقة من المزود' }, { status: 500 });
    }

    // Deduct charge once and give Points
    currentUserBalance -= pkg.price;
    const pointsToAdd = 100; // Big packages = big points

    await prisma.user.update({
       where: { id: user.id },
       data: { balance: currentUserBalance, points: { increment: pointsToAdd } }
    });

    await prisma.notification.create({
       data: {
          userId: user.id,
          title: '🔥 باقة مشاهير مباعة!',
          message: 'تم البدء في تنفيذ ' + pkg.name + '. استعد للانفجار! حصلت على ' + pointsToAdd + ' نقطة كهدية.'
       }
    });

    return NextResponse.json({ success: true, newBalance: currentUserBalance, message: 'تم شراء الباقة بنجاح والعمل جاري عليها!' });
  } catch (error) {
    console.error("Packages API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
