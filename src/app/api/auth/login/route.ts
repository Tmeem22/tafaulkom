import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { login, password } = data; // login can be email or username

    if (!login || !password) {
      return NextResponse.json({ error: 'الرجاء إدخال اسم المستخدم وكلمة المرور' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          { username: login }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    // Check for email verification
    if (!user.emailVerified && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'يرجى تفعيل حسابك من خلال الرابط المرسل لبريدك الإلكتروني أولاً.' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    // Set JWT Session Cookie
    const sessionToken = await encrypt({ userId: user.id, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 365 days
      path: '/'
    });

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
