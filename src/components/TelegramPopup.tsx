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
    <div className="popup-overlay z-[3000]" onClick={dismiss}>
      <div
        className="card animate-fade-in-up p-10 max-w-[420px] w-[90%] text-center relative shadow-[var(--shadow-xl)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 left-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--brand-danger)] hover:invert hover:brightness-0"
          aria-label="إغلاق"
        >
          <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={16} height={16} alt="إغلاق" />
        </button>

        {/* Telegram Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0088cc] to-[#00aaff] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(0,136,204,0.3)] animate-bounce-gentle">
          <img src="https://img.icons8.com/color/256/telegram-app.png" width={48} height={48} className="brightness-0 invert" alt="أيقونة تيليجرام" />
        </div>

        <h2 className="text-[1.5rem] font-extrabold text-[var(--text-primary)] mb-2" dir="rtl">
          انضم لقناتنا على تيليغرام!
        </h2>
        <p className="text-[var(--text-secondary)] text-[0.9rem] leading-[1.7] mb-6" dir="rtl">
          احصل على أحدث العروض والخصومات الحصرية وآخر أخبار الخدمات مباشرة على تيليغرام.
        </p>

        {/* Features */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap" dir="rtl">
          {[
            { text: 'عروض حصرية', icon: 'https://img.icons8.com/fluency/256/gift.png' },
            { text: 'أخبار فورية', icon: 'https://img.icons8.com/fluency/256/megaphone.png' },
            { text: 'خصومات خاصة', icon: 'https://img.icons8.com/fluency/256/sale.png' }
          ].map((item, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[0.75rem] font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
              <img src={item.icon} width={16} height={16} alt={item.text} />
              {item.text}
            </span>
          ))}
        </div>

        <a
          href="https://t.me/tafaulkom"
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-full bg-gradient-to-br from-[#0088cc] to-[#00aaff] text-white font-extrabold text-[1rem] no-underline shadow-[0_4px_15px_rgba(0,136,204,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,136,204,0.4)]"
        >
          انضم للقناة الآن
        </a>

        <button
          onClick={dismiss}
          className="bg-transparent border-none text-[var(--text-tertiary)] text-[0.8rem] cursor-pointer mt-4 font-semibold hover:text-[var(--text-secondary)] transition-colors"
          dir="rtl"
        >
          لا شكراً، ربما لاحقاً
        </button>
      </div>
    </div>
  );
}
