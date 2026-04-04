import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromSession();

  // Protect Admin Route at the layout level
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://img.icons8.com/parakeet/256/crown.png" width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            لوحة الإدارة
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin/users" style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.8rem', transition: 'background 0.2s' }} className="admin-nav-item">
            <img src="https://img.icons8.com/parakeet/256/group-of-projects.png" width={20} height={20} /> إدارة المستخدمين
          </Link>
          <Link href="/admin/tickets" style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.8rem', transition: 'background 0.2s' }} className="admin-nav-item">
            <img src="https://img.icons8.com/parakeet/256/headset.png" width={20} height={20} /> تذاكر الدعم الفني
          </Link>
          <Link href="/admin/deposits" style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.8rem', transition: 'background 0.2s' }} className="admin-nav-item">
            <img src="https://img.icons8.com/parakeet/256/money.png" width={20} height={20} /> الإيداعات المالية
          </Link>
          <Link href="/dashboard" style={{ marginTop: 'auto', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src="https://img.icons8.com/parakeet/256/home.png" width={20} height={20} /> العودة للموقع
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>أهلاً بك يا مدير النظام</h2>
          <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700 }}>
            صلاحيات كاملة
          </div>
        </header>

        {children}
      </main>

      <style>{`
        .admin-nav-item:hover {
          background: var(--bg-primary);
        }
      `}</style>
    </div>
  );
}
