import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json({
        id: null,
        username: 'ضيّف',
        balance: 0.00,
        currency: 'USD'
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      id: user.id, 
      username: user.username,
      balance: user.balance || 0.00,
      currency: 'USD',
      role: user.role
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
