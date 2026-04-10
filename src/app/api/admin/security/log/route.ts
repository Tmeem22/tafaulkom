import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const secret = process.env.SECURITY_SECRET || 'internal-secret-123';
    const clientSecret = request.headers.get('x-security-secret');

    if (clientSecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ip, event, severity, userAgent } = await request.json();

    await prisma.securityLog.create({
      data: {
        ip,
        event,
        severity: severity || 'INFO',
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log security event:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
