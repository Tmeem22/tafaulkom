import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromSession();

  // Protect Admin Route at the layout level - High Security
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  const adminLinks = [
    { label: 'نظرة عامة', href: '/admin', icon: 'https://img.icons8.com/fluency/256/dashboard.png' },
    { label: 'إدارة المستخدمين', href: '/admin/users', icon: 'https://img.icons8.com/fluency/256/group-of-projects.png' },
    { label: 'إدارة الخدمات', href: '/admin/services', icon: 'https://img.icons8.com/fluency/256/services.png' },
    { label: 'سجل الطلبات', href: '/admin/orders', icon: 'https://img.icons8.com/fluency/256/shopping-basket.png' },
    { label: 'تذاكر الدعم', href: '/admin/tickets', icon: 'https://img.icons8.com/fluency/256/headset.png' },
    { label: 'الإيداعات', href: '/admin/deposits', icon: 'https://img.icons8.com/fluency/256/safe.png' },
    { label: 'مركز الأمن', href: '/admin/security', icon: 'https://img.icons8.com/fluency/256/checked-shield.png' },
    { label: 'طلبات التعويض', href: '/admin/refills', icon: 'https://img.icons8.com/fluency/256/help.png' },
  ];

  return (
    <div dir="rtl" className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Admin Sidebar - Hidden on mobile, visible on lg screens */}
      <aside className="w-[280px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-8 px-5 flex-col sticky top-0 h-screen overflow-y-auto z-50 hidden lg:flex">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="w-12 h-12 rounded-[16px] bg-[var(--gradient-primary)] flex items-center justify-center shadow-[0_8px_20px_rgba(108,60,225,0.3)]">
            <img src="https://img.icons8.com/fluency/256/crown.png" width={28} height={28} className="brightness-0 invert" alt="Admin" />
          </div>
          <div>
            <span className="text-[1.1rem] font-black text-[var(--text-primary)] block leading-tight">إدارة تفاعلكم</span>
            <span className="text-[0.7rem] text-[var(--brand-primary)] font-bold uppercase tracking-wider">Premium Admin</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {adminLinks.map((link, i) => (
            <Link key={i} href={link.href} className="group relative no-underline flex items-center gap-4 p-3.5 px-5 rounded-[15px] transition-all duration-300 hover:bg-[var(--brand-primary)]/5">
              <div className="w-2 h-0 group-hover:h-5 bg-[var(--brand-primary)] absolute right-0 rounded-l-full transition-all"></div>
              <img src={link.icon} width={24} height={24} className="opacity-80 group-hover:opacity-100 transition-opacity" alt={link.label} />
              <span className="text-[0.95rem] font-bold text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors">{link.label}</span>
            </Link>
          ))}

          <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
            <Link href="/dashboard" className="no-underline flex items-center gap-4 p-3.5 px-5 rounded-[15px] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold hover:bg-[var(--brand-primary)] hover:text-white transition-all shadow-sm">
              <img src="https://img.icons8.com/fluency/256/home.png" width={22} height={22} alt="Home" /> العودة للموقع
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[var(--bg-secondary)]/30 backdrop-blur-3xl relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-primary)]/5 rounded-full blur-[120px] -z-10"></div>
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[var(--border-color)]">
          <div>
            <h2 className="text-[1.6rem] md:text-[1.8rem] font-black text-[var(--text-primary)] tracking-tight">لوحة الإدارة الرئيسية</h2>
            <p className="text-[var(--text-secondary)] text-[0.85rem] md:text-[0.9rem] font-medium">مرحباً بك مجدداً، لديك كامل الصلاحيات لإدارة المنصة</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-[var(--bg-card)] p-2.5 px-5 rounded-[18px] border border-[var(--border-color)] flex items-center gap-3 shadow-[var(--shadow-sm)]">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[0.85rem] font-bold text-[var(--text-primary)]">النظام متصل</span>
             </div>
             <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[var(--brand-primary)] shadow-md">
                <img src={`https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=6c3ce1&color=fff`} alt="Admin Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <section className="animate-in fade-in duration-700">
          {children}
        </section>
      </main>
    </div>
  );
}
