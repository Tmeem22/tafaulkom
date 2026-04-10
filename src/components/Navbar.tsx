"use client";

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check session
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notifications logic
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (Array.isArray(data)) {
          const unread = data.filter((n: any) => !n.isRead).length;
          // Play sound if new message arrives
          if (unread > unreadCount) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
            audio.play().catch(() => {});
          }
          setNotifications(data);
          setUnreadCount(unread);
        }
      } catch (e) {}
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [user, unreadCount]);

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-[70px]">
          
          {/* Logo */}
          <Link href="/" className="no-underline flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="تفاعلكم - SMM Panel" 
              className="h-[60px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/services" className="px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] no-underline text-[0.9rem] font-semibold transition-all hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
              خدماتنا
            </Link>
            <Link href="/how-it-works" className="px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] no-underline text-[0.9rem] font-semibold transition-all hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
              كيف يعمل
            </Link>
            <Link href="/blog" className="px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] no-underline text-[0.9rem] font-semibold transition-all hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
              المدونة
            </Link>

            <div className="w-[1px] h-6 bg-[var(--border-color)] mx-2" />

            <button onClick={toggleTheme} className="theme-toggle flex items-center justify-center" aria-label="تبديل الثيم">
              {theme === 'light' ? (
                <img src="https://img.icons8.com/fluency/256/moon.png" width={20} height={20} alt="تغيير للوضع الليلي" />
              ) : (
                <img src="https://img.icons8.com/fluency/256/sun.png" width={20} height={20} alt="تغيير للوضع المضيء" />
              )}
            </button>

            {!loading && (
              user ? (
                <div className="flex items-center gap-4 mr-4">
                  <div className="relative cursor-pointer group p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-all"
                       onClick={() => {
                         setShowNotifications(!showNotifications);
                         if (!showNotifications && unreadCount > 0) markAllAsRead();
                       }}>
                    <img src="https://img.icons8.com/fluency/256/bell.png" width={22} height={22} alt="التنبيهات" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[var(--brand-danger)] text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-[var(--bg-card)] shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse px-1">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Home Button */}
                  <Link href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all no-underline">
                    <img src="https://img.icons8.com/fluency/256/home.png" width={20} height={20} alt="Home" />
                    <span className="text-[0.8rem] font-bold text-white">الرئيسية</span>
                  </Link>

                  {/* Orders Button */}
                  <Link href="/dashboard" className="px-4 py-2 bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 rounded-xl flex items-center gap-2 hover:bg-[var(--brand-primary)] group transition-all no-underline">
                    <img src="https://img.icons8.com/fluency/256/shopping-cart.png" width={20} height={20} alt="Orders" className="group-hover:brightness-0 group-hover:invert" />
                    <span className="text-[0.8rem] font-bold text-[var(--brand-primary)] group-hover:text-white transition-colors">الذهاب للطلبات</span>
                  </Link>

                  {/* Account Settings with Badge */}
                  <Link href="/dashboard/account" className="relative px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-center gap-2 hover:bg-[var(--bg-card)] transition-all group overflow-visible no-underline">
                    <img src="https://img.icons8.com/fluency/256/manager.png" width={20} height={20} alt="Account" />
                    <span className="text-[0.8rem] font-black text-[var(--text-primary)]">إعدادات حسابي</span>
                    {notifications.length > 0 && (
                      <div className="absolute -top-2 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[var(--bg-primary)] animate-bounce shadow-lg z-[60]">
                        1
                      </div>
                    )}
                  </Link>

                  {/* Profile / Notifications Toggle */}
                  <div className="relative group">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-1 rounded-full border-2 border-[var(--brand-primary)] overflow-hidden hover:scale-105 transition-all shadow-sm"
                    >
                      <img src="https://img.icons8.com/papercut/256/user-male-circle.png" width={30} height={30} alt="Profile" className="bg-[var(--bg-secondary)] rounded-full" />
                    </button>
                    
                    {showNotifications && (
                      <div className="absolute top-full left-0 mt-3 w-72 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[20px] shadow-[var(--shadow-lg)] z-50 overflow-hidden backdrop-blur-md">
                        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center text-[0.8rem] font-bold text-[var(--text-primary)] bg-white/5">
                          <span>التنبيهات</span>
                          <button onClick={() => setNotifications([])} className="text-emerald-400 hover:text-emerald-300 transition-colors text-[0.7rem] font-black">استلم الكل ✅</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                           {notifications.length > 0 ? (
                             notifications.map((n) => (
                               <div key={n.id} className="p-4 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)] transition-all">
                                 <h4 className="m-0 text-[0.85rem] font-bold text-[var(--text-primary)] mb-1">{n.title}</h4>
                                 <p className="m-0 text-[0.75rem] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{n.message}</p>
                                 <button 
                                   onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                                   className="mt-2 w-full py-1.5 bg-emerald-500/10 text-emerald-400 text-[0.7rem] font-black rounded-lg hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-1"
                                 >تم الاستلام</button>
                               </div>
                             ))
                           ) : (
                              <div className="p-8 text-center text-[var(--text-secondary)]">لا توجد تنبيهات</div>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 mr-4">
                  <Link href="/login" className="btn-secondary py-2 px-6 text-[0.85rem]">تسجيل الدخول</Link>
                  <Link href="/register" className="btn-primary py-2 px-6 text-[0.85rem]">سجل مجاناً</Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button onClick={toggleTheme} className="theme-toggle flex items-center justify-center p-2" aria-label="تبديل الثيم">
              {theme === 'light' ? (
                <img src="https://img.icons8.com/fluency/256/moon.png" width={20} height={20} alt="الوضع الليلي" />
              ) : (
                <img src="https://img.icons8.com/fluency/256/sun.png" width={20} height={20} alt="الوضع المضيء" />
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="bg-transparent border-none flex items-center justify-center text-[var(--text-primary)] cursor-pointer p-2" aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}>
              {mobileOpen ? (
                <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={24} height={24} alt="إغلاق" />
              ) : (
                <img src="https://img.icons8.com/fluency/256/menu.png" width={24} height={24} alt="القائمة" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border-color)] flex flex-col gap-2">
            <Link href="/services" className="px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] no-underline font-semibold hover:bg-[var(--bg-secondary)]" onClick={() => setMobileOpen(false)}>خدماتنا</Link>
            <Link href="/how-it-works" className="px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] no-underline font-semibold hover:bg-[var(--bg-secondary)]" onClick={() => setMobileOpen(false)}>كيف يعمل</Link>
            <Link href="/blog" className="px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] no-underline font-semibold hover:bg-[var(--bg-secondary)]" onClick={() => setMobileOpen(false)}>المدونة</Link>
            <div className="flex gap-3 mt-2 px-4">
              {user ? (
                <>
                  <Link href="/dashboard/account" className="btn-primary flex-1 text-center py-3 flex items-center justify-center gap-2" onClick={() => setMobileOpen(false)}>
                    <img src="https://img.icons8.com/fluency/256/manager.png" width={18} height={18} className="brightness-0 invert" alt="حسابي" />
                    <span>حسابي</span>
                  </Link>
                  <Link href="/dashboard" className="btn-secondary flex-1 text-center py-3" onClick={() => setMobileOpen(false)}>لوحة التحكم</Link>
                  <Link href="/dashboard/support" className="p-3 bg-[var(--bg-secondary)] rounded-[14px] flex items-center justify-center" onClick={() => setMobileOpen(false)}>
                    <img src="https://img.icons8.com/fluency/256/bell.png" width={24} height={24} alt="التنبيهات" />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary flex-1 text-center py-3" onClick={() => setMobileOpen(false)}>دخول</Link>
                  <Link href="/register" className="btn-primary flex-1 text-center py-3" onClick={() => setMobileOpen(false)}>تسجيل</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; align-items: center; gap: 0.25rem; }
        }
      `}</style>
    </nav>
  );
}
