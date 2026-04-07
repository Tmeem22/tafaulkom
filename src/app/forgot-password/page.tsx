"use client";

import { useState } from 'react';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setSent(true);
        showToast("تم إرسال رابط استعادة كلمة المرور بنجاح", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "فشل إرسال رابط الاستعادة", "error");
      }
    } catch (error) {
      showToast("حدث خطأ في الاتصال بالسيرفر", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg min-h-screen flex items-center justify-center pt-[90px] relative overflow-hidden">
        <div className="max-w-[440px] w-full px-6 relative z-10 py-12">
          <div className="card animate-fade-in-up p-10 md:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--gradient-primary)]" />
            <div className="mb-6 flex justify-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner ${sent ? 'bg-emerald-500/10' : 'bg-[var(--bg-secondary)]'}`}>
                <img 
                  src={sent ? 'https://img.icons8.com/fluency/256/checkmark.png' : 'https://img.icons8.com/fluency/256/lock-landscape.png'} 
                  width={64} 
                  height={64} 
                  alt={sent ? "تم الإرسال" : "قفل"}
                />
              </div>
            </div>
            <h1 className="text-[1.5rem] font-black text-[var(--text-primary)] mb-2">
              {sent ? 'تم الإرسال بنجاح!' : 'نسيت كلمة المرور؟'}
            </h1>
            <p className="text-[var(--text-secondary)] text-[0.9rem] mb-8 leading-relaxed">
              {sent 
                ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد (Spam أيضاً).' 
                : 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور الخاصة بك.'}
            </p>

            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                  <input 
                    type="email" 
                    className="input-field !text-center !py-4 font-bold" 
                    placeholder="example@email.com" 
                    dir="ltr" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="البريد الإلكتروني"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="btn-primary w-full !py-4 !rounded-xl !font-black flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
                >
                  {isLoading ? (
                    <>
                      <img src="https://img.icons8.com/fluency/256/hourglass.png" width={20} height={20} className="animate-spin brightness-0 invert" alt="جاري التحميل" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <img src="https://img.icons8.com/fluency/256/sent.png" width={20} height={20} className="brightness-0 invert" alt="إرسال" />
                      إرسال رابط الاستعادة
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <Link href="/login" className="btn-primary w-full !py-4 !rounded-xl !font-black no-underline block shadow-lg shadow-purple-500/20">
                  العودة لتسجيل الدخول
                </Link>
                <p className="text-[0.8rem] text-[var(--text-tertiary)]">لم يصلك الرمز؟ <button onClick={() => setSent(false)} className="bg-transparent border-none text-[var(--brand-primary)] font-bold cursor-pointer p-0">حاول مرة أخرى</button></p>
              </div>
            )}

            {!sent && (
              <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                <Link href="/login" className="text-[var(--brand-primary)] no-underline font-bold text-[0.85rem] inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                   <img src="https://img.icons8.com/fluency/256/right.png" width={16} height={16} alt="سهم" /> العودة لتسجيل الدخول
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
