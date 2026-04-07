"use client";

import { useState } from 'react';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';
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
        showToast("تم تسجيل الدخول بنجاح! مرحباً بك.", "success");
        router.push('/dashboard');
      } else {
        showToast(data.error || "فشل تسجيل الدخول", "error");
      }
    } catch (e) {
      showToast("فشل الاتصال بخادم السيرفر", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="login-container">
        <div className="login-wrapper">
          <div className="card login-card animate-fade-in-up">
            <div className="login-header">
              <Link href="/" className="login-logo-link">
                <img src="/logo.png" alt="شعار تفاعلكوم" className="login-logo" />
              </Link>
              <h1 className="login-title">أهلاً بعودتك!</h1>
              <p className="login-subtitle">سجّل الدخول للمتابعة إلى لوحة التحكم</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <img src="https://img.icons8.com/fluency/256/mail.png" width={22} height={22} alt="أيقونة البريد" />
                  </span>
                  <input 
                    type="text" 
                    required 
                    value={login} 
                    onChange={e => setLogin(e.target.value)} 
                    className="input-field input-with-padding" 
                    placeholder="example@mail.com" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">كلمة المرور</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <img src="https://img.icons8.com/fluency/256/lock.png" width={22} height={22} alt="أيقونة القفل" />
                  </span>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="input-field input-with-padding" 
                    placeholder="••••••••••" 
                    dir="ltr" 
                  />
                </div>
              </div>

              <div className="form-actions">
                <Link href="/forgot-username" className="action-link tertiary">استعادة الحساب</Link>
                <Link href="/forgot-password" className="action-link primary">استعادة كلمة المرور</Link>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary login-submit-btn">
                {isLoading ? (
                  <>
                    <img src="https://img.icons8.com/fluency/256/hourglass.png" width={22} height={22} className="animate-spin btn-icon-invert" alt="تحميل" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <img src="https://img.icons8.com/fluency/256/key.png" width={22} height={22} className="btn-icon-invert" alt="دخول" />
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              ليس لديك حساب؟ <Link href="/register" className="register-link">سجّل الآن مجاناً</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 90px;
          background: var(--bg-hero);
        }
        .login-wrapper {
          max-width: 440px;
          width: 100%;
          padding: 0 1.5rem;
          position: relative;
          z-index: 1;
        }
        .login-card {
          padding: 3.5rem 2.5rem;
        }
        .login-header {
          text-align: center;
          marginBottom: 2.5rem;
        }
        .login-logo-link {
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        .login-logo {
          height: 70px;
          width: auto;
          object-fit: contain;
        }
        .login-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }
        .login-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 500;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.6rem;
          margin-right: 4px;
        }
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          opacity: 0.8;
          z-index: 2;
        }
        .input-with-padding {
          padding-right: 3rem !important;
          height: 54px;
          font-weight: 600;
        }
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -0.5rem;
        }
        .action-link {
          font-size: 0.85rem;
          text-decoration: none;
          font-weight: 700;
        }
        .action-link.tertiary { color: var(--text-tertiary); }
        .action-link.primary { color: var(--brand-primary); }
        
        .login-submit-btn {
          width: 100%;
          padding: 1rem !important;
          font-size: 1.1rem !important;
          height: 56px;
        }
        .btn-icon-invert {
          filter: brightness(0) invert(1);
        }
        .login-footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.95rem;
          color: var(--text-tertiary);
          font-weight: 600;
        }
        .register-link {
          color: var(--brand-primary);
          font-weight: 800;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
