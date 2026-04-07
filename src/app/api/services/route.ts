import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { id: 'asc' }
    });
    
    // Default profit margin for services without a custom rate override
    const DEFAULT_PROFIT_MARGIN = 1.50; // +50%
    
    const formattedServices = services.map(service => {
      // If a customRate exists, use it. Otherwise, apply the default markup to the originalRate.
      const finalRate = service.customRate 
        ? service.customRate 
        : service.originalRate * DEFAULT_PROFIT_MARGIN;
      
      return {
        service: service.id.toString(),
        name: service.name,
        category: service.category,
        rate: finalRate.toFixed(4),
        min: service.min.toString(),
        max: service.max.toString(),
        refill: service.refill
      };
    });

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error("Failed to fetch services from DB:", error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
