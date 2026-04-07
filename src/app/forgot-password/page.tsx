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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
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
    } catch (err) {
      showToast("حدث خطأ في الاتصال بالسيرفر", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '90px' }}>
        <div style={{ maxWidth: '440px', width: '100%', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <div className="card animate-fade-in-up" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={sent ? 'https://img.icons8.com/fluency/256/checkmark.png' : 'https://img.icons8.com/fluency/256/lock-landscape.png'} 
                width={80} 
                height={80} 
              />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {sent ? 'تم الإرسال!' : 'استعادة كلمة المرور'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              {sent ? 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.' : 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.'}
            </p>

            {error && <div style={{ color: '#ff4d4d', fontSize: '0.85rem', marginBottom: '1rem', background: 'rgba(255,77,77,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="أدخل بريدك الإلكتروني" 
                  dir="ltr" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                  {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                </button>
              </form>
            ) : (
              <Link href="/login" className="btn-primary" style={{ width: '100%', padding: '0.9rem', display: 'block', textAlign: 'center' }}>
                العودة لتسجيل الدخول
              </Link>
            )}

            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              <Link href="/login" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
