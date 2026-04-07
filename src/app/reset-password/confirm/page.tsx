"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/hooks/useNotification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ConfirmResetContent() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password })
      });
      
      if (res.ok) {
        showToast("تم تغيير كلمة المرور بنجاح! يمكنك الآن الدخول باستخدام كلمة المرور الجديدة.", "success");
        router.push('/login');
      } else {
        const data = await res.json();
        showToast(data.error || "فشل تغيير كلمة المرور", "error");
      }
    } catch (error) {
      showToast("حدث خطأ في الاتصال بالسيرفر", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[440px] w-full px-6 relative z-10 py-12">
      <div className="card animate-fade-in-up p-10 md:p-12 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--gradient-primary)]" />
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center shadow-inner">
            <img 
              src="https://img.icons8.com/fluency/256/assignment-turned-in.png" 
              width={64} 
              height={64} 
              alt="تأكيد"
            />
          </div>
        </div>
        <h1 className="text-[1.5rem] font-black text-[var(--text-primary)] mb-2">تغيير كلمة المرور</h1>
        <p className="text-[var(--text-secondary)] text-[0.9rem] mb-8 leading-relaxed">
           أدخل كلمة المرور الجديدة لحسابك:<br/><b className="text-[var(--brand-primary)]" dir="ltr">{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="password" 
            className="input-field !text-center !py-4 font-bold" 
            placeholder="كلمة المرور الجديدة" 
            dir="ltr" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="كلمة المرور الجديدة"
          />
          <button 
            type="submit" 
            disabled={isLoading} 
            className="btn-primary w-full !py-4 !rounded-xl !font-black flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
          >
            {isLoading ? (
              <>
                <img src="https://img.icons8.com/fluency/256/hourglass.png" width={20} height={20} className="animate-spin brightness-0 invert" alt="جاري الحفظ" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <img src="https://img.icons8.com/fluency/256/checkmark.png" width={20} height={20} className="brightness-0 invert" alt="تأكيد" />
                تأكيد التغيير
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ConfirmReset() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg min-h-screen flex items-center justify-center pt-[90px] relative overflow-hidden">
        <Suspense fallback={<div className="text-[var(--text-secondary)] font-bold animate-pulse">جاري التحميل...</div>}>
          <ConfirmResetContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
