import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { encrypt } from '@/lib/auth';

export default async function AdminAccessPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const secretToken = process.env.ADMIN_ACCESS_TOKEN;

  // 1. Verify Token
  if (!token || token !== secretToken) {
    console.error('Invalid admin access token attempt');
    redirect('/');
  }

  // 2. Find Admin User
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.error('No admin user found in database');
    redirect('/');
  }

  // 3. Create Session
  const sessionToken = await encrypt({ userId: admin.id, role: admin.role });
  const cookieStore = await cookies();
  
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  });

  // 4. Success Redirect
  redirect('/admin/users');
}
