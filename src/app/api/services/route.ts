import { NextResponse } from 'next/server';
export const revalidate = 600; // Cache for 10 minutes
import prisma from '@/lib/prisma';
import { USD_TO_SAR_RATE, DEFAULT_PROFIT_MARGIN } from '@/lib/constants';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { id: 'asc' }
    });
    
    const formattedServices = services.map(service => {
      // Convert original cost (USD) from provider to SAR cost
      const costInSar = service.originalRate * USD_TO_SAR_RATE;
      
      // If a customRate exists (now treated as SAR), use it. 
      // Otherwise, apply the default markup to the SAR cost.
      const finalRate = service.customRate 
        ? service.customRate 
        : costInSar * DEFAULT_PROFIT_MARGIN;
      
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
