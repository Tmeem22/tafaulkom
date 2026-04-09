import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const username = 'tymlghby_o1602t';
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: 100.0 }
      });
      return NextResponse.json({ success: true, message: `Balance for ${username} set to 100.0 SAR` });
    }
    
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
