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
    } catch (e) {
      showToast('فشل الاتصال بخادم تفاعلكم', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '90px' }}>
        <div style={{ maxWidth: '480px', width: '100%', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <div className="card animate-fade-in-up" style={{ padding: '3.5rem 2.5rem', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(108,60,225,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <span style={{ fontSize: '2.5rem' }}>🔍</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>تذكير اسم المستخدم</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>أدخل بريدك الإلكتروني وسنقوم بإرسال اسم المستخدم الخاص بك.</p>
            </div>

            {message.text && (
              <div style={{ 
                padding: '1rem 1.2rem', borderRadius: '16px', marginBottom: '2rem', fontSize: '0.95rem', 
                fontWeight: 600, background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                color: message.type === 'success' ? '#10b981' : '#ef4444', 
                display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid transparent',
                borderColor: message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{message.type === 'success' ? '✅' : '❌'}</span> {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>البريد الإلكتروني</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', opacity: 0.7 }}>📧</span>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="input-field" 
                    placeholder="example@mail.com" 
                    dir="ltr"
                    style={{ paddingRight: '2.8rem', height: '54px', borderRadius: '16px' }} 
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ 
                width: '100%', padding: '1.1rem', fontSize: '1.1rem', fontWeight: 900, 
                borderRadius: '16px', boxShadow: '0 8px 25px rgba(108,60,225,0.3)',
                transition: 'all 0.3s'
              }}>
                {isLoading ? '⏳ جاري البحث...' : '🔍 إرسال اسم المستخدم'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <Link href="/login" style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
                color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none',
                fontSize: '0.95rem'
              }}>
                <span style={{ fontSize: '1.1rem' }}>➡️</span> العودة لصفحة الدخول
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
