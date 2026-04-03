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
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <div style="background: #6C3CE1; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">تفاعلكم</h1>
        </div>
        <h2 style="color: #333;">استعادة كلمة المرور</h2>
        <p style="color: #666; font-size: 1.1rem;">لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في <b>تفاعلكم</b>.</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="display:inline-block; padding: 14px 30px; background: #6C3CE1; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(108,60,225,0.3);">إعادة تعيين كلمة المرور</a>
        </div>
        <p style="margin-top:20px; font-size:0.85rem; color:#999;">إذا لم تكن أنت من طلب ذلك، يمكنك تجاهل هذه الرسالة بكل بساطة.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #888; font-size: 0.8rem;">© 2026 تفاعلكم - جميع الحقوق محفوظة</p>
      </div>`;
      
      try {
        await sendMail(email, "تفاعلكم - استعادة كلمة المرور 🔐", html);
      } catch (mailError) {
        console.error("Critical error: Email failed to send for reset password:", mailError);
        return NextResponse.json({ error: 'الرسالة ما تروح، فيه مشكلة في السيرفر' }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}
