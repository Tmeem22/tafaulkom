"use client";
import { useState, useEffect } from 'react';

export default function TelegramPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('tg_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('tg_popup_dismissed', '1');
  };

  return (
    <div className="popup-overlay" onClick={dismiss} style={{ zIndex: 3000 }}>
      <div
        className="card animate-fade-in-up"
        onClick={e => e.stopPropagation()}
        style={{ padding: '2.5rem', maxWidth: '420px', width: '90%', textAlign: 'center', position: 'relative' }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-danger)'; e.currentTarget.style.filter = 'brightness(0) invert(1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.filter = 'none'; }}
        >
          <img src="https://img.icons8.com/parakeet/256/delete-sign.png" width={16} height={16} />
        </button>

        {/* Telegram Icon */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #0088cc 0%, #00aaff 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', boxShadow: '0 8px 30px rgba(0,136,204,0.3)',
          animation: 'bounce-gentle 2s ease-in-out infinite',
        }}>
          <img src="https://img.icons8.com/color/256/telegram-app.png" width={48} height={48} style={{ filter: 'brightness(0) invert(1)' }} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }} dir="rtl">
          انضم لقناتنا على تيليغرام!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }} dir="rtl">
          احصل على أحدث العروض والخصومات الحصرية وآخر أخبار الخدمات مباشرة على تيليغرام.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }} dir="rtl">
          {[
            { text: 'عروض حصرية', icon: 'https://img.icons8.com/parakeet/256/gift.png' },
            { text: 'أخبار فورية', icon: 'https://img.icons8.com/parakeet/256/megaphone.png' },
            { text: 'خصومات خاصة', icon: 'https://img.icons8.com/parakeet/256/sale.png' }
          ].map((item, i) => (
            <span key={i} style={{
              padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              <img src={item.icon} width={16} height={16} />
              {item.text}
            </span>
          ))}
        </div>

        <a
          href="https://t.me/tafaulkom"
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.9rem', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #0088cc 0%, #00aaff 100%)',
            color: 'white', fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0,136,204,0.3)', transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,136,204,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,136,204,0.3)'; }}
        >
          انضم للقناة الآن
        </a>

        <button
          onClick={dismiss}
          style={{
            background: 'none', border: 'none', color: 'var(--text-tertiary)',
            fontSize: '0.8rem', cursor: 'pointer', marginTop: '1rem',
            fontFamily: 'inherit', fontWeight: 600,
          }}
          dir="rtl"
        >
          لا شكراً، ربما لاحقاً
        </button>
      </div>
    </div>
  );
}
