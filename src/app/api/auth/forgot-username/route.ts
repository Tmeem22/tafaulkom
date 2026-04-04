import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'الرجاء إدخال البريد الإلكتروني' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
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
            <h2 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;">تذكير باسم المستخدم 👤</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
              لقد تلقينا طلباً لتذكيرك باسم المستخدم الخاص بحسابك في <b>تفاعلكم</b>. إليك التفاصيل:
            </p>
            
            <div style="background-color: #f0f2f9; border: 1px solid #e0e4f0; border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: center;">
              <p style="margin: 0; color: #888; font-size: 14px; margin-bottom: 10px;">اسم المستخدم الخاص بك هو:</p>
              <h3 style="margin: 0; color: #6C3CE1; font-size: 28px; font-weight: 900;">${user.username}</h3>
            </div>
            
            <div style="margin-bottom: 30px;">
              <a href="${req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display:inline-block; padding: 16px 36px; background-color: #6C3CE1; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(108,60,225,0.3);">تسجيل الدخول الآن</a>
            </div>
            
            <p style="font-size: 14px; color: #888;">
              إذا لم تكن أنت من طلب هذا التذكير، يرجى التحقق من أمان حسابك.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="padding: 20px; background-color: #fafbfd; border-top: 1px solid #eeeeee; text-align: center;">
            <p style="font-size: 12px; color: #aaa; margin: 0;">&copy; 2026 Tafaulkom. All rights reserved.</p>
          </div>
        </div>
      </div>`;
      
      try {
        await sendMail(email, "تفاعلكم - تذكير باسم المستخدم 👤", html);
      } catch (mailError) {
        console.error("Forgot username email failed:", mailError);
        return NextResponse.json({ error: 'لم نتمكن من إرسال البريد الإلكتروني حالياً' }, { status: 500 });
      }
    }
    
    // Always return success for security
    return NextResponse.json({ success: true, message: 'إذا كان البريد مسجلاً، فستصلك رسالة تحتوي على اسم المستخدم قريباً.' });
  } catch (err) {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}
