import { NextResponse } from 'next/server';
import { getProviderServices } from '@/lib/smm-api';

export async function GET() {
  try {
    const services = await getProviderServices();
    
    // Add 50% profit margin to all services
    const PROFIT_MARGIN = 1.50; // +50%
    
    const profitServices = services.map(service => {
      const originalRate = parseFloat(service.rate);
      const newRate = originalRate * PROFIT_MARGIN;
      
      return {
        ...service,
        rate: newRate.toFixed(4) // Keep 4 decimal places for precision
      };
    });

    return NextResponse.json(profitServices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
