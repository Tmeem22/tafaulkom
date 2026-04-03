import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Determine content type (form-data or json)
    const contentType = req.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
    } else {
      // Trying to parse as json as fallback or raw
      const raw = await req.text();
      try { body = JSON.parse(raw); } catch { /* ignore */ }
    }

    const { key, action } = body;

    if (!key) {
      return NextResponse.json({ error: "Incorrect request" }, { status: 400 });
    }

    // Authenticate user via apiKey
    const user = await prisma.user.findUnique({ where: { apiKey: key } });
    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Action routers
    switch (action) {
      case 'balance':
        return NextResponse.json({ balance: user.balance.toFixed(5), currency: "USD" });

      case 'services':
        // Return active services (Using our internal API fetch style but simplified since we don't have a local DB table for services right now)
        // Usually you'd fetch from your DB or pass from original SMM provider
        // Here we just return a static list or fetch from provider and inflate price
        try {
          const sRes = await fetch(`${process.env.SMM_PROVIDER_URL}?key=${process.env.SMM_PROVIDER_KEY}&action=services`);
          const sData = await sRes.json();
          if (Array.isArray(sData)) {
            const mapped = sData.map(s => ({
              service: s.service,
              name: s.name,
              type: s.type,
              category: s.category,
              rate: (parseFloat(s.rate) * 1.5).toFixed(5), // 50% profit margin
              min: s.min,
              max: s.max,
              refill: s.refill,
              cancel: s.cancel
            }));
            return NextResponse.json(mapped);
          }
          return NextResponse.json(sData);
        } catch {
          return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
        }

      case 'add':
        const { service, link, quantity } = body;
        if (!service || !link || !quantity) return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });

        // Fetch service price logic
        const pRes = await fetch(`${process.env.SMM_PROVIDER_URL}?key=${process.env.SMM_PROVIDER_KEY}&action=services`);
        const pData = await pRes.json();
        const srv = Array.isArray(pData) ? pData.find(s => String(s.service) === String(service)) : null;

        if (!srv) return NextResponse.json({ error: "Service not found" }, { status: 400 });

        const localPrice = parseFloat(srv.rate) * 1.5;
        const totalCost = (localPrice / 1000) * Number(quantity);

        if (user.balance < totalCost) {
          return NextResponse.json({ error: "Not enough funds on balance" }, { status: 400 });
        }

        // Place order with provider
        const fData = new URLSearchParams();
        fData.append('key', process.env.SMM_PROVIDER_KEY!);
        fData.append('action', 'add');
        fData.append('service', String(service));
        fData.append('link', String(link));
        fData.append('quantity', String(quantity));

        const orderRes = await fetch(process.env.SMM_PROVIDER_URL!, {
          method: 'POST',
          body: fData,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const orderData = await orderRes.json();
        
        if (orderData.error) {
          console.error("Provider Error:", orderData.error);
          return NextResponse.json({ error: "Service currently unavailable" }, { status: 400 });
        }

        const providerOrderId = orderData.order;

        // Atomic Transaction (Deduct balance + Create order)
        const result = await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: user.id },
            data: { balance: { decrement: totalCost } }
          });

          return await tx.order.create({
            data: {
              userId: user.id,
              providerOrderId: String(providerOrderId),
              service: String(service),
              link: String(link),
              quantity: Number(quantity),
              charge: totalCost,
              remains: Number(quantity),
              status: 'pending'
            }
          });
        });

        return NextResponse.json({ order: result.id });

      case 'status':
        const { order } = body;
        if (!order) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

        const existingOrder = await prisma.order.findUnique({ where: { id: Number(order) } });
        if (!existingOrder || existingOrder.userId !== user.id) {
          return NextResponse.json({ error: "Incorrect order ID" }, { status: 400 });
        }

        return NextResponse.json({
          charge: existingOrder.charge.toFixed(5),
          start_count: existingOrder.startCount.toString(),
          status: existingOrder.status,
          remains: existingOrder.remains.toString(),
          currency: "USD"
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (e) {
    console.error("V2 API Error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
