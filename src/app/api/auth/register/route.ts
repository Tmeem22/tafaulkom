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
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f8fc; padding: 40px 20px; text-align: center; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6C3CE1 0%, #4B28A1 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">تفاعلكم</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 10px; font-size: 16px;">مرحباً بك في أفضل منصة خدمات SMM 🚀</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;">تفعيل الحساب الجديد</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
            أهلاً بك يا <b>${username}</b>! نحن متحمسون جداً لانضمامك إلى مجتمع <b>تفاعلكم</b>. 
            يرجى استخدام رمز التحقق التالي لإتمام عملية التسجيل وتفعيل حسابك:
          </p>
          
          <div style="background-color: #f0f2f9; border: 2px dashed #6C3CE1; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; color: #6C3CE1; letter-spacing: 8px;">${verificationToken}</span>
          </div>
          
          <p style="font-size: 14px; color: #888; line-height: 1.5;">
            هذا الرمز مخصص لمرة واحدة فقط. إذا لم تكن أنت من قام بإنشاء هذا الحساب، يرجى تجاهل هذا البريد.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; background-color: #fafbfd; border-top: 1px solid #eeeeee; text-align: center;">
          <p style="font-size: 12px; color: #aaa; margin: 0;">&copy; 2026 Tafaulkom. All rights reserved.</p>
          <div style="margin-top: 10px;">
            <a href="https://tafaulkom.com" style="color: #6C3CE1; text-decoration: none; font-size: 12px; font-weight: 600;">موقعنا الرسمي</a>
            <span style="color: #ddd; margin: 0 10px;">|</span>
            <a href="https://t.me/tafaulkom" style="color: #6C3CE1; text-decoration: none; font-size: 12px; font-weight: 600;">الدعم الفني</a>
          </div>
        </div>
      </div>
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
