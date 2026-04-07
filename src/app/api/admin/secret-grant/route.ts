import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const SECRET_PASSWORD = '0551499154';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== SECRET_PASSWORD) {
      return NextResponse.json({ error: 'كلمة المرور غير صحيحة يا مدير' }, { status: 401 });
    }

    // Get current user from official session
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'عذراً، يجب عليك تسجيل الدخول أولاً بحسابك العادي ثم استخدام الباب السري' }, { status: 401 });
    }

    const userId = session.userId;

    // Verify user exists first
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ 
        error: 'عذراً، جلسة دخولك قديمة أو غير صالحة. يرجى تسجيل الخروج ثم الدخول مرة أخرى لتحديث حسابك.' 
      }, { status: 404 });
    }

    // Grant Admin Role in Database
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    });

    return NextResponse.json({ success: true, message: 'تم فتح الباب بنجاح! أنت الآن مدير النظام بكامل الصلاحيات.' });
  } catch (error: any) {
    console.error('Secret Door Error:', error);
    return NextResponse.json({ 
      error: `حدث خطأ تقني: فحص الحساب غير متاح حالياً` 
    }, { status: 500 });
  }
}
