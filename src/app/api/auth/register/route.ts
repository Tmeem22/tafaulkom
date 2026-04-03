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
    
    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 5. Create user
    const role = email.toLowerCase() === 'tymlghby@gmail.com' ? 'ADMIN' : 'USER';
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        balance: 0.00,
        role: role,
        emailVerified: false,
        verificationToken: verificationToken
      }
    });

    // 6. Verification Link
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyLink = `${origin}/api/auth/verify?token=${verificationToken}`;
    
    const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <div style="background: #6C3CE1; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0;">تفاعلكم</h1>
      </div>
      <h2 style="color: #333;">تفعيل الحساب 🚀</h2>
      <p style="color: #666; font-size: 1.1rem;">أهلاً بك في <b>تفاعلكم</b>! يرجى الضغط على الزر أدناه لتفعيل حسابك والبدء في استخدام المنصة.</p>
      <div style="margin: 30px 0;">
        <a href="${verifyLink}" style="display:inline-block; padding: 14px 30px; background: #6C3CE1; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(108,60,225,0.3);">تفعيل حسابي الآن</a>
      </div>
      <p style="margin-top:20px; font-size:0.85rem; color:#999;">إذا واجهت أي مشكلة، لا تتردد في التواصل معنا.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #888; font-size: 0.8rem;">© 2026 تفاعلكم - أفضل منصة SMM عربية</p>
    </div>`;

    try {
      await sendMail(email, "تفعيل حسابك في تفاعلكم 🚀", html);
    } catch (mailError) {
      console.error("Critical: Registration email failed:", mailError);
      return NextResponse.json({ error: 'الرسالة ما تروح، فيه مشكلة في السيرفر' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'تم إنشاء الحساب، يرجى تفعيل البريد الإلكتروني' });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
