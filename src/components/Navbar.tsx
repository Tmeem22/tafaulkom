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
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              alt="تفاعلكم" 
              style={{ height: '60px', width: 'auto', objectFit: 'contain' }} 
            />
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
            <Link href="/services" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}>
              خدماتنا
            </Link>
            <Link href="/how-it-works" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}>
              كيف يعمل
            </Link>
            <Link href="/blog" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}>
              المدونة
            </Link>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }} />

            <button onClick={toggleTheme} className="theme-toggle" aria-label="تبديل الثيم" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'light' ? (
                <img src="https://img.icons8.com/parakeet/256/moon.png" width={20} height={20} />
              ) : (
                <img src="https://img.icons8.com/parakeet/256/sun.png" width={20} height={20} />
              )}
            </button>

            {!loading && (
              user ? (
                <>
                  <Link href="/dashboard" className="btn-secondary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', background: 'var(--brand-danger)', boxShadow: 'none' }}>
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
                    تسجيل الدخول
                  </Link>
                  <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
                    سجل مجاناً
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Hamburger */}
          <div style={{ display: 'none' }} className="mobile-nav-toggle">
            <button onClick={toggleTheme} className="theme-toggle" style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'light' ? (
                <img src="https://img.icons8.com/parakeet/256/moon.png" width={20} height={20} />
              ) : (
                <img src="https://img.icons8.com/parakeet/256/sun.png" width={20} height={20} />
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
              {mobileOpen ? (
                <img src="https://img.icons8.com/parakeet/256/delete-sign.png" width={24} height={24} />
              ) : (
                <img src="https://img.icons8.com/parakeet/256/menu.png" width={24} height={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ padding: '1rem 0 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="mobile-menu">
            <Link href="/services" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }} onClick={() => setMobileOpen(false)}>خدماتنا</Link>
            <Link href="/how-it-works" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }} onClick={() => setMobileOpen(false)}>كيف يعمل</Link>
            <Link href="/blog" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }} onClick={() => setMobileOpen(false)}>المدونة</Link>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-secondary" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>لوحة التجكم</Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn-primary" style={{ flex: 1, textAlign: 'center', background: 'var(--brand-danger)' }}>خروج</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>دخول</Link>
                  <Link href="/register" className="btn-primary" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>تسجيل</Link>
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
