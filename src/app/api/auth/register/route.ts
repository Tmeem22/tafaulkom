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
        emailVerified: false,
        verificationToken: verificationToken
      }
    });

    // 6. Verification Code Email
    const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <div style="background: #6C3CE1; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0;">تفاعلكم</h1>
      </div>
      <h2 style="color: #333;">رمز تفعيل الحساب 🚀</h2>
      <p style="color: #666; font-size: 1.1rem;">أهلاً بك في <b>تفاعلكم</b>! رمز التحقق الخاص بك هو:</p>
      <div style="margin: 30px 0;">
        <div style="display:inline-block; padding: 15px 40px; background: #f4f4f4; color: #333; letter-spacing: 5px; border-radius: 12px; font-weight: bold; font-size: 2rem; border: 2px dashed #6C3CE1;">${verificationToken}</div>
      </div>
      <p style="margin-top:20px; font-size:0.85rem; color:#999;">يرجى إدخال هذا الرمز في صفحة التسجيل لتفعيل حسابك.</p>
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
