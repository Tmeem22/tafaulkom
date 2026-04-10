"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkFlashSale = () => {
      const now = new Date();
      const saleStart = new Date(now);
      saleStart.setHours(21, 0, 0, 0); // 9 PM
      const saleEnd = new Date(now);
      saleEnd.setHours(22, 0, 0, 0); // 10 PM

      if (now >= saleStart && now < saleEnd) {
        setIsActive(true);
        const diff = saleEnd.getTime() - now.getTime();
        setTimeLeft({
          hours: 0,
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else if (now < saleStart) {
        setIsActive(false);
        const diff = saleStart.getTime() - now.getTime();
        setTimeLeft({
          hours: Math.floor(diff / 1000 / 60 / 60),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setIsActive(false);
      }
    };

    checkFlashSale();
    const interval = setInterval(checkFlashSale, 1000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className={`fixed top-[70px] left-0 right-0 z-40 transition-all ${isActive ? 'bg-gradient-to-l from-red-600 via-orange-500 to-red-600' : 'bg-gradient-to-l from-purple-600 via-indigo-600 to-purple-600'}`} dir="rtl">
      <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-center justify-center gap-4 relative">
        <button onClick={() => setDismissed(true)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-[1rem] font-bold">✕</button>

        {isActive ? (
          <>
            <span className="text-[1rem] animate-pulse">⚡</span>
            <p className="text-white font-black text-[0.85rem] md:text-[0.95rem]">
              الساعة الذهبية الآن! خصم 30% على كل الخدمات 🔥
            </p>
            <div className="flex gap-1.5 items-center" dir="ltr">
              <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-white font-black text-[0.9rem] min-w-[32px] text-center">{pad(timeLeft.minutes)}</span>
              <span className="text-white font-black">:</span>
              <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-white font-black text-[0.9rem] min-w-[32px] text-center">{pad(timeLeft.seconds)}</span>
            </div>
            <Link href="/dashboard" className="bg-white text-red-600 font-black text-[0.75rem] px-4 py-1.5 rounded-full no-underline hover:scale-105 transition-all shadow-md hidden md:inline-block">
              اطلب الآن!
            </Link>
          </>
        ) : (
          <>
            <span className="text-[0.9rem]">⏰</span>
            <p className="text-white font-bold text-[0.8rem] md:text-[0.85rem]">
              الساعة الذهبية (9-10 مساءً) تبدأ بعد
            </p>
            <div className="flex gap-1 items-center" dir="ltr">
              {timeLeft.hours > 0 && (
                <>
                  <span className="bg-white/15 px-2 py-0.5 rounded text-white font-black text-[0.8rem]">{pad(timeLeft.hours)}</span>
                  <span className="text-white/60 text-[0.7rem]">:</span>
                </>
              )}
              <span className="bg-white/15 px-2 py-0.5 rounded text-white font-black text-[0.8rem]">{pad(timeLeft.minutes)}</span>
              <span className="text-white/60 text-[0.7rem]">:</span>
              <span className="bg-white/15 px-2 py-0.5 rounded text-white font-black text-[0.8rem]">{pad(timeLeft.seconds)}</span>
            </div>
            <span className="text-white/60 text-[0.7rem] font-bold hidden md:inline">خصم 30%!</span>
          </>
        )}
      </div>
    </div>
  );
}
