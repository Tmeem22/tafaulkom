import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getProviderServices, getProviderBalance } from '@/lib/smm-api';


export async function GET(request: Request) {
  try {
    const providerServices = await getProviderServices();
    console.log(`Sync Task: Found ${providerServices.length} services from provider.`);
    
    if (providerServices.length === 0) {
      const balance = await getProviderBalance();
      console.error("Sync Error: Provider returned 0 services. Current Balance:", balance);
      return NextResponse.json({ error: 'No services found from provider', balance }, { status: 400 });
    }

    let syncedCount = 0;
    
    // Sync services to database
    for (const service of providerServices) {
      await prisma.service.upsert({
        where: { id: Number(service.service) },
        update: {
          name: service.name,
          category: service.category,
          originalRate: parseFloat(service.rate),
          min: Number(service.min),
          max: Number(service.max),
          refill: service.refill,
        },
        create: {
          id: Number(service.service),
          name: service.name,
          category: service.category,
          originalRate: parseFloat(service.rate),
          min: Number(service.min),
          max: Number(service.max),
          refill: service.refill,
          active: true,
        }
      });
      syncedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} services.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Sync Services Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
