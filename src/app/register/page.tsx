"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast("كلمتا المرور غير متطابقتين", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ref: refCode })
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast(data.message || "تم إنشاء حسابك وتفعيله بنجاح!", "success");
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 2000);
      } else {
        showToast(data.error || "فشل التسجيل", "error");
      }
    } catch (e) {
      showToast("فشل الاتصال بالخادم", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fields = [
    { name: 'email', label: 'البريد الإلكتروني', type: 'text', icon: 'https://img.icons8.com/fluency/256/mail.png', placeholder: 'name@example.com', dir: 'ltr' },
    { name: 'password', label: 'كلمة المرور', type: 'password', icon: 'https://img.icons8.com/fluency/256/lock.png', placeholder: '••••••••••••', dir: 'ltr' },
    { name: 'confirmPassword', label: 'تأكيد كلمة المرور', type: 'password', icon: 'https://img.icons8.com/fluency/256/checked-checkbox.png', placeholder: '••••••••••••', dir: 'ltr' },
  ];

  const floatingIcons = [
    { icon: 'instagram-new', class: 'icon-1' },
    { icon: 'tiktok', class: 'icon-2' },
    { icon: 'youtube-play', class: 'icon-3' },
    { icon: 'facebook-new', class: 'icon-4' },
    { icon: 'twitter', class: 'icon-5' },
    { icon: 'snapchat', class: 'icon-6' },
  ];

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg min-h-screen pt-[90px]">
        <div className="max-w-[1280px] mx-auto px-6 py-12 relative z-[1]">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="animate-fade-in-up">
              <h1 className="text-[2rem] font-extrabold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/rocket.png" width={40} height={40} alt="أيقونة انطلاق" />
                هل أنت جاهز؟
              </h1>
              <p className="text-[var(--text-secondary)] mb-8 text-[0.95rem]">
                افتح حساباً في <strong className="text-[var(--brand-primary)]">تفاعلكم</strong> الآن! وابدأ في رحلة نمو حساباتك. تفصلك خطوة واحدة عن أفضل تجربة تسويق عربية.
              </p>
              {refCode && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                  <img src="https://img.icons8.com/fluency/256/gift.png" width={28} height={28} alt="gift" />
                  <div>
                    <p className="font-black text-emerald-600 text-[0.85rem]">تم تطبيق رابط إحالة!</p>
                    <p className="text-[0.7rem] text-[var(--text-secondary)]">سجّل الآن واستمتع بخدمات تفاعلكم المميزة</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleRegister} className="flex flex-col gap-5">
                {fields.map((field, i) => (
                  <div key={i}>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8">
                        <img src={field.icon} width={20} height={20} alt={field.label} />
                      </span>
                      <input 
                        type={field.type} 
                        name={field.name}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        required
                        className="input-field pr-[3.2rem] bg-[var(--bg-card)] border-[1.5px] border-[var(--border-color)] h-[56px]" 
                        placeholder={field.placeholder}
                        dir={field.dir}
                        aria-label={field.label}
                      />
                    </div>
                  </div>
                ))}

                <button 
                  type="submit" 
                  className="btn-dark w-full py-4 text-[1.1rem] mt-4 flex items-center justify-center gap-3 rounded-[var(--radius-lg)] font-bold transition-transform active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <img src="https://img.icons8.com/fluency/256/hourglass.png" width={24} height={24} className="animate-spin brightness-0 invert" alt="جاري التحميل" />
                      جاري التحقق والتسجيل...
                    </>
                  ) : 'سجّل الآن في تفاعلكم'}
                </button>
              </form>

              <div className="text-center mt-6 text-[var(--text-tertiary)] text-[0.9rem]">
                هل لديك حساب؟ <Link href="/login" className="text-[var(--brand-primary)] font-bold no-underline hover:opacity-80">تسجيل الدخول</Link>
              </div>
            </div>

            <div className="animate-slide-right flex justify-center items-center">
              <div className="relative w-full max-w-[440px]">
                <div className="rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] border-[1.5px] border-[var(--border-color)] bg-[var(--bg-card)] animate-pulse-glow">
                  <img src="/hero.png" alt="SMM Growth Illustration" className="w-full h-auto block" />
                </div>
                
                {floatingIcons.map((item, i) => (
                  <div key={i} className={`animate-float absolute w-[60px] h-[60px] rounded-[18px] bg-white/5 backdrop-blur-[12xl] border-[1.5px] border-[var(--border-color)] flex items-center justify-center shadow-[var(--shadow-lg)] z-10 ${item.class}`}>
                    <img src={`https://img.icons8.com/color/96/${item.icon}.png`} alt={`${item.icon} icon`} width={32} height={32} className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .icon-1 { top: 10%; left: -10%; animation-delay: 0s; }
          .icon-2 { top: 5%; right: -5%; animation-delay: 0.5s; }
          .icon-3 { top: 22%; left: -18%; animation-delay: 1s; }
          .icon-4 { bottom: 5%; right: -12%; animation-delay: 1.5s; }
          .icon-5 { top: 40%; left: -22%; animation-delay: 2s; }
          .icon-6 { top: 35%; right: -18%; animation-delay: 2.5s; }
        `}</style>
      </main>
      <Footer />
    </>
  );
}

export default function Register() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
