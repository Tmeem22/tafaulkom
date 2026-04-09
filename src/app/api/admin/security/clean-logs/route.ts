import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // Check for specialized cron secret if needed, but for now we'll allow it (Vercel crons can be secured via headers)
  const authHeader = request.headers.get('authorization');
  
  // In a real app, you'd check a secret here
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    // Delete logs older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.securityLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${result.count} security logs.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to clean security logs:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
