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
    } catch (err) {
      showToast("حدث خطأ في الاتصال بالسيرفر", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', width: '100%', padding: '0 1.5rem' }}>
      <div className="card animate-fade-in-up" style={{ padding: '3rem 2.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>تغيير كلمة المرور</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>
          أدخل كلمة المرور الجديدة لحسابك: <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input 
            type="password" 
            className="input-field" 
            placeholder="كلمة المرور الجديدة" 
            dir="ltr" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
            {isLoading ? 'جاري الحفظ...' : 'تأكيد التغيير'}
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
      <main dir="rtl" className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '90px' }}>
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <ConfirmResetContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
