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
      <div className="max-w-[1280px] mx-auto px-6 py-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="تفاعلكم - SMM Panel" 
                className="h-[60px] w-auto object-contain"
              />
            </div>
            <p className="text-[var(--text-secondary)] text-[0.9rem] leading-[1.8] max-w-[300px]">
              تفاعلكم هي المنصة الأسرع والأرخص لجميع خدمات التسويق الإلكتروني وزيادة المتابعين، نخدم عملاءنا من جميع أنحاء العالم العربي.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <a href="mailto:tymlghby@gmail.com" className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] no-underline text-[0.8rem] font-semibold flex items-center gap-2 hover:border-[var(--brand-primary)] transition-colors">
                <img src="https://img.icons8.com/fluency/48/mail.png" width={16} height={16} alt="البريد الإلكتروني" /> tymlghby@gmail.com
              </a>
              <a href="tel:0501645063" className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] no-underline text-[0.8rem] font-semibold flex items-center gap-2 hover:border-[var(--brand-primary)] transition-colors" dir="ltr">
                <img src="https://img.icons8.com/fluency/48/phone.png" width={16} height={16} alt="رقم الهاتف" /> 0501645063
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-[var(--text-primary)] text-[1rem]">روابط سريعة</h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-[var(--text-secondary)] no-underline text-[0.9rem] transition-colors hover:text-[var(--brand-primary)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-[var(--text-primary)] text-[1rem]">المنصات المدعومة</h4>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map(p => (
                <Link key={p} href="/services" className="px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] no-underline text-[0.75rem] font-bold transition-all hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-[var(--text-primary)] text-[1rem]">قانوني</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/terms" className="text-[var(--text-secondary)] no-underline text-[0.9rem] hover:text-[var(--brand-primary)] transition-colors">الشروط والأحكام لحقوق الاستخدام</Link>
              <Link href="/terms#privacy" className="text-[var(--text-secondary)] no-underline text-[0.9rem] hover:text-[var(--brand-primary)] transition-colors">سياسة الخصوصية</Link>
              <Link href="/terms#refund" className="text-[var(--text-secondary)] no-underline text-[0.9rem] hover:text-[var(--brand-primary)] transition-colors">سياسة الاسترجاع</Link>
              <Link href="/terms#disclaimer" className="text-[var(--text-secondary)] no-underline text-[0.9rem] hover:text-[var(--brand-primary)] transition-colors">إخلاء المسؤولية</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-color)] pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[var(--text-tertiary)] text-[0.8rem] font-medium">
            حقوق تفاعلكم 2026 © جميع الحقوق محفوظة لـ تفاعلكم.
          </p>
          <div className="flex gap-2 items-center">
            <span className="text-[0.8rem] text-[var(--text-tertiary)] flex items-center gap-1.5 font-medium">
              صنع بـ <img src="https://img.icons8.com/fluency/48/filled-like.png" width={14} height={14} alt="حب" /> لعملائنا
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
