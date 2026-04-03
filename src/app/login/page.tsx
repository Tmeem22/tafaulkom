"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { useRouter } from 'next/navigation';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Here we could store JWT/user info, for demo we just redirect
        router.push('/dashboard');
      } else {
        alert(data.error || "فشل تسجيل الدخول");
      }
    } catch (e) {
      alert("فشل الاتصال بخادم السيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '90px' }}>
        <div style={{ maxWidth: '440px', width: '100%', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <div className="card animate-fade-in-up" style={{ padding: '3rem 2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
              </Link>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>أهلاً بعودتك! 👋</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>سجّل الدخول للمتابعة إلى لوحة التحكم</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>اسم المستخدم أو البريد الإلكتروني</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>👤</span>
                  <input type="text" required value={login} onChange={e => setLogin(e.target.value)} className="input-field" placeholder="اسم المستخدم" style={{ paddingRight: '2.5rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>كلمة المرور</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔒</span>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••••" dir="ltr" style={{ paddingRight: '2.5rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/forgot-username" style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 600 }}>نسيت اسم المستخدم؟</Link>
                <Link href="/reset-password" style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600 }}>نسيت كلمة المرور؟</Link>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                {isLoading ? '⏳ جاري التحقق...' : '🔑 تسجيل الدخول'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
              ليس لديك حساب؟ <Link href="/register" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none' }}>سجّل الآن مجاناً</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
