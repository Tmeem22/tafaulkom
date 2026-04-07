"use client";

import { useState } from 'react';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotUsername() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/auth/forgot-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast(data.message || 'إذا كان البريد مسجلاً، فستصلك رسالة قريباً.', 'success');
        setEmail('');
      } else {
        showToast(data.error || 'فشل إرسال الطلب', 'error');
      }
    } catch (error) {
      showToast('فشل الاتصال بخادم تفاعلكم', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg min-h-screen flex items-center justify-center pt-[90px] relative overflow-hidden">
        <div className="max-w-[480px] w-full px-6 relative z-10 py-12">
          <div className="card animate-fade-in-up p-10 md:p-14 rounded-[30px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--gradient-primary)]" />
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-[var(--brand-primary)]/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <img src="https://img.icons8.com/fluency/256/search.png" width={48} height={48} alt="أيقونة البحث" />
              </div>
              <h1 className="text-[2rem] font-black text-[var(--text-primary)] mb-3 tracking-tight">استعادة الحساب</h1>
              <p className="text-[var(--text-secondary)] text-[1rem] leading-relaxed">أدخل بريدك الإلكتروني وسنقوم بإرسال بيانات الدخول الخاصة بك.</p>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-8 text-[0.95rem] font-bold flex items-center gap-3 border transition-all ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                <img src={message.type === 'success' ? 'https://img.icons8.com/fluency/256/checkmark.png' : 'https://img.icons8.com/fluency/256/error.png'} width={22} height={22} alt="أيقونة الحالة" /> {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label htmlFor="email-input" className="block text-[0.85rem] font-black text-[var(--text-secondary)] mr-1">البريد الإلكتروني</label>
                <div className="relative group">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-70 group-focus-within:opacity-100 transition-opacity">
                    <img src="https://img.icons8.com/fluency/256/envelope.png" width={20} height={20} alt="أيقونة البريد" />
                  </span>
                  <input 
                    id="email-input"
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="input-field !pr-12 !h-[56px] !rounded-2xl !font-bold" 
                    placeholder="example@mail.com" 
                    dir="ltr"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                className="btn-primary w-full !py-4 !text-[1.1rem] !font-black !rounded-2xl shadow-xl shadow-purple-500/25 active:scale-[0.98] transition-transform"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src="https://img.icons8.com/fluency/256/hourglass.png" width={24} height={24} className="animate-spin brightness-0 invert" alt="جاري التحميل" />
                    جاري البحث...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <img src="https://img.icons8.com/fluency/256/search.png" width={24} height={24} className="brightness-0 invert" alt="بحث" />
                    إرسال بيانات الدخول
                  </div>
                )}
              </button>
            </form>

            <div className="text-center mt-10 pt-6 border-t border-[var(--border-color)]">
              <Link href="/login" className="inline-flex items-center gap-2 text-[var(--brand-primary)] font-black no-underline text-[0.95rem] hover:opacity-80 transition-opacity">
                <img src="https://img.icons8.com/fluency/256/left.png" width={20} height={20} alt="سهم العودة" /> العودة لصفحة الدخول
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
