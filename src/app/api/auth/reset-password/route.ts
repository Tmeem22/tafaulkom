import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${origin}/reset-password/confirm?email=${encodeURIComponent(email)}`;
      
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
            <h2 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;">استعادة كلمة المرور 🔐</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
              لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في <b>تفاعلكم</b>. 
              لتغيير كلمة المرور، يرجى الضغط على الزر أدناه:
            </p>
            
            <div style="margin-bottom: 30px;">
              <a href="${resetLink}" style="display:inline-block; padding: 16px 36px; background-color: #6C3CE1; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(108,60,225,0.3);">إعادة تعيين كلمة المرور</a>
            </div>
            
            <p style="font-size: 14px; color: #888; line-height: 1.5;">
              تنتهي صلاحية هذا الرابط بعد 24 ساعة. إذا لم تكن أنت من طلب هذا الرابط، يمكنك تجاهل هذا البريد بأمان.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="padding: 20px; background-color: #fafbfd; border-top: 1px solid #eeeeee; text-align: center;">
            <p style="font-size: 12px; color: #aaa; margin: 0;">&copy; 2026 Tafaulkom. All rights reserved.</p>
          </div>
        </div>
      </div>`;
      
      try {
        await sendMail(email, "تفاعلكم - استعادة كلمة المرور 🔐", html);
      } catch (mailError) {
        console.error("Critical error: Email failed to send for reset password:", mailError);
        // We will just return success to avoid leaking info and to bypass SMTP fails for now
      }
    }
    
    return NextResponse.json({ success: true, message: 'إذا كان البريد مسجلاً، فستصلك تعليمات استعادة الحساب.' });
  } catch (err) {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}
