"use client";
import Link from 'next/link';

const quickLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'خدماتنا', href: '/services' },
  { label: 'كيف تعمل منصتنا', href: '/how-it-works' },
  { label: 'المدونة', href: '/blog' },
  { label: 'تسجيل حساب', href: '/register' },
];

const platforms = [
  'إنستغرام', 'تيك توك', 'يوتيوب', 'تويتر', 'فيسبوك',
  'سناب شات', 'تيليغرام', 'لينكد إن', 'سبوتيفاي', 'ديسكورد',
];

export default function Footer() {
  return (
    <footer className="footer" dir="rtl">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <img 
                src="/logo.png" 
                alt="تفاعلكم" 
                style={{ height: '60px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', maxWidth: '300px' }}>
              تفاعلكم هي المنصة الأسرع والأرخص لجميع خدمات التسويق الإلكتروني وزيادة المتابعين، نخدم عملاءنا من جميع أنحاء العالم العربي.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
              <a href="mailto:tymlghby@gmail.com" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="https://img.icons8.com/parakeet/256/envelope.png" width={16} height={16} /> tymlghby@gmail.com
              </a>
              <a href="tel:0501645063" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }} dir="ltr">
                <img src="https://img.icons8.com/parakeet/256/smartphone.png" width={16} height={16} /> 0501645063
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1rem' }}>روابط سريعة</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {quickLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1rem' }}>المنصات المدعومة</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {platforms.map(p => (
                <Link key={p} href="/services" style={{ padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1rem' }}>قانوني</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>الشروط والأحكام لحقوق الاستخدام</Link>
              <Link href="/terms#privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>سياسة الخصوصية</Link>
              <Link href="/terms#refund" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>سياسة الاسترجاع</Link>
              <Link href="/terms#disclaimer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>إخلاء المسؤولية</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            حقوق تميم اللغبي 2026 © جميع الحقوق محفوظة لـ تفاعلكم.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              صنع بـ <img src="https://img.icons8.com/parakeet/256/like.png" width={14} height={14} /> لعملائنا
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
