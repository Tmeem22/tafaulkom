import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderOrder } from '@/lib/smm-api';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
    }

    const { key, action } = body;

    if (!key) {
      return NextResponse.json({ error: "Incorrect request" }, { status: 400 });
    }

    // Authenticate user
    const user = await prisma.user.findUnique({ where: { apiKey: key } });
    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    switch (action) {
      case 'balance':
        return NextResponse.json({ balance: user.balance.toFixed(5), currency: "SAR" });

      case 'services':
        const services = await prisma.service.findMany({ where: { active: true } });
        return NextResponse.json(services.map(s => ({
          service: s.id.toString(),
          name: s.name,
          type: "Default",
          category: s.category,
          rate: (s.customRate || (s.originalRate * 3.75 * 1.5)).toFixed(5),
          min: s.min.toString(),
          max: s.max.toString(),
          refill: s.refill,
          cancel: false
        })));

      case 'add':
        const { service, link, quantity } = body;
        if (!service || !link || !quantity) return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });

        const srv = await prisma.service.findUnique({ where: { id: Number(service) } });
        if (!srv) return NextResponse.json({ error: "Service not found" }, { status: 400 });

        const rate = (srv.customRate || (srv.originalRate * 3.75 * 1.5));
        const totalCost = (rate / 1000) * Number(quantity);

        if (user.balance < totalCost) {
          return NextResponse.json({ error: "Not enough funds on balance" }, { status: 400 });
        }

        // Place order with provider
        const providerResponse = await createProviderOrder(srv.id, link, Number(quantity));
        
        if (providerResponse.error) {
          return NextResponse.json({ error: "Service currently unavailable" }, { status: 400 });
        }

        const providerOrderId = providerResponse.order;

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
              service: srv.name,
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
          currency: "SAR"
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (e) {
    console.error("V2 API Error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
