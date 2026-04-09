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
    <div className="popup-overlay z-[3000] p-4 backdrop-blur-[4px]" onClick={dismiss}>
      <div
        className="animate-fade-in-up max-w-[440px] w-full bg-[#0a0a0c] border border-white/10 rounded-[30px] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-clip-padding"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-b from-[#0088cc]/20 to-transparent pointer-events-none" />
        
        {/* Close button - Styled for the new design */}
        <button
          onClick={dismiss}
          className="absolute top-5 left-5 z-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-all active:scale-95"
          aria-label="إغلاق"
        >
          <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={18} height={18} className="brightness-0 invert" alt="إغلاق" />
        </button>

        <div className="p-8 pt-10 text-center relative z-0">
          {/* 3D Telegram Icon - Replacing the blue circle */}
          <div className="relative w-[140px] h-[140px] mx-auto mb-4 group">
            <div className="absolute inset-0 bg-[#0088cc]/30 blur-[40px] rounded-full group-hover:bg-[#0088cc]/50 transition-all duration-500" />
            <img 
              src="/telegram_3d_premium_icon_1775762522928.png" 
              className="relative w-full h-full object-contain animate-float drop-shadow-[0_10px_20px_rgba(0,136,204,0.4)]"
              alt="أيقونة تيليجرام 3D" 
            />
          </div>

          <h2 className="text-[1.8rem] font-black text-white mb-3 tracking-tight leading-tight" dir="rtl">
            عالم من <span className="text-[#0088cc]">المفاجآت</span> ينتظرك!
          </h2>
          <p className="text-white/70 text-[1rem] leading-[1.6] mb-8 max-w-[320px] mx-auto" dir="rtl">
            كن أول المنضمين واحصل على كود خصم حصري لمشتركي قناتنا الجدد فقط. 🚀
          </p>

          {/* New Premium Badges */}
          <div className="flex gap-2 justify-center mb-10 flex-wrap" dir="rtl">
            {[
              { text: 'هدايا أسبوعية', icon: '🎁', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
              { text: 'تحديثات فورية', icon: '⚡', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
              { text: 'كوبونات حصرية', icon: '🏷️', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
            ].map((item, i) => (
              <span key={i} className={`px-4 py-2 rounded-2xl border ${item.color} text-[0.8rem] font-bold flex items-center gap-2 backdrop-blur-md`}>
                <span>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>

          <a
            href="https://t.me/tafaulkom"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="group relative inline-flex items-center justify-center gap-3 w-full py-5 rounded-[22px] bg-[#0088cc] text-white font-black text-[1.1rem] no-underline transition-all duration-300 hover:bg-[#0099ee] hover:shadow-[0_10px_30px_rgba(0,136,204,0.4)] hover:-translate-y-1 active:scale-[0.98]"
          >
            <span>انضم الآن واحصل على الهدية</span>
            <img src="https://img.icons8.com/material-rounded/24/ffffff/long-arrow-left.png" width={20} height={20} className="animate-push-left" alt="سهم" />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-[22px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <button
            onClick={dismiss}
            className="mt-6 text-white/40 text-[0.9rem] font-medium hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
            dir="rtl"
          >
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
}
