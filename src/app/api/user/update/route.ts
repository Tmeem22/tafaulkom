import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getUserFromSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password, currentPassword } = await request.json();

    const updateData: any = {};

    // 1. Update Username if provided
    if (username && username !== user.username) {
      // Check if username taken
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) {
        return NextResponse.json({ error: 'اسم المستخدم مأخوذ بالفعل' }, { status: 400 });
      }
      updateData.username = username;
    }

    // 2. Update Password if provided
    if (password) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'يجب إدخال كلمة المرور الحالية لتغييرها' }, { status: 400 });
      }

      // Verify current password
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      const isValid = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isValid) {
        return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }

      if (password.length < 8) {
        return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
      }

      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    return NextResponse.json({ success: true, message: 'تم تحديث البيانات بنجاح' });

  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
