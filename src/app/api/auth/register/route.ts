import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import dns from 'dns';
import { promisify } from 'util';
import { sendMail } from '@/lib/mailer';
import crypto from 'crypto';

const resolveMx = promisify(dns.resolveMx);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { username, email, password } = data;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 2. Simple Email validation (Allow '321' special dev account)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email.toLowerCase() !== '321') {
      return NextResponse.json({ error: 'صيغة البريد الإلكتروني غير صحيحة' }, { status: 400 });
    }

    // 3. User & Username setup
    const effectiveUsername = username || email.split('@')[0] + '_' + Math.random().toString(36).substring(7);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: effectiveUsername }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 400 });
    }
    
    // 4. Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() || 'tymlghby@gmail.com';
    const adminUsername = process.env.ADMIN_USERNAME || '0501645063';
    
    // ⭐ SPECIAL DEVELOPER CHECK ('321' Email)
    const isDeveloper = email.toLowerCase() === '321' || email.toLowerCase() === adminEmail || effectiveUsername === adminUsername;
    const role = isDeveloper ? 'ADMIN' : 'USER';

    const newUser = await prisma.user.create({
      data: {
        username: effectiveUsername,
        email,
        password: hashedPassword,
        balance: 0.00,
        role: role,
        emailVerified: true // ⚡ Direct activation
      }
    });

    return NextResponse.json({ success: true, message: 'تم إنشاء حسابك وتفعيله بنجاح! يمكنك الآن تسجيل الدخول.' });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
