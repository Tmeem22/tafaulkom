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

    // 1. Regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'صيغة البريد الإلكتروني غير صحيحة' }, { status: 400 });
    }

    // 2. Real Domain / MX record check
    const domain = email.split('@')[1];
    try {
      const records = await resolveMx(domain);
      if (!records || records.length === 0) {
        return NextResponse.json({ error: 'البريد الإلكتروني المدخل لا يستقبل رسائل (نطاق غير صالح)' }, { status: 400 });
      }
    } catch (err) {
      return NextResponse.json({ error: 'البريد الإلكتروني وهمي أو غير حقيقي' }, { status: 400 });
    }

    // 3. Check if user already exists in Prisma DB
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو اسم المستخدم مستخدم مسبقاً' }, { status: 400 });
    }
    
    // 4. Hash Password & Generate 6-char Alphanumeric Code
    const hashedPassword = await bcrypt.hash(password, 10);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let verificationToken = '';
    for(let i = 0; i < 6; i++) {
      verificationToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // 5. Create user
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() || 'tymlghby@gmail.com';
    const adminUsername = process.env.ADMIN_USERNAME || '0501645063';
    
    const role = (email.toLowerCase() === adminEmail || username === adminUsername) ? 'ADMIN' : 'USER';
    const newUser = await prisma.user.create({
      data: {
        username,
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
