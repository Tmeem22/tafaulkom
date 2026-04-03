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
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <div style="background: #6C3CE1; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">تفاعلكم</h1>
        </div>
        <h2 style="color: #333;">تذكير باسم المستخدم 👤</h2>
        <p style="color: #666; font-size: 1.1rem;">لقد تلقينا طلباً لتذكيرك باسم المستخدم الخاص بحسابك في <b>تفاعلكم</b>.</p>
        
        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border: 1px dashed #6C3CE1; display: inline-block;">
          <p style="margin: 0; color: #999; font-size: 0.85rem;">اسم المستخدم الخاص بك هو:</p>
          <h3 style="margin: 10px 0 0; color: #6C3CE1; font-size: 1.8rem; font-weight: 900;">${user.username}</h3>
        </div>

        <p style="margin-top:20px; font-size:0.85rem; color:#999;">يمكنك الآن استخدامه لتسجيل الدخول إلى حسابك.</p>
        <div style="margin: 30px 0;">
          <a href="${req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display:inline-block; padding: 12px 25px; background: #6C3CE1; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 1rem;">الذهاب لصفحة الدخول</a>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #888; font-size: 0.8rem;">© 2026 تفاعلكم - جميع الحقوق محفوظة</p>
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
