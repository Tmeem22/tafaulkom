"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function SecretDoor() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0551499154') {
      setLoading(true);
      try {
        // We'll call a special API to grant admin access based on this password
        const res = await fetch('/api/admin/secret-grant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        
        const data = await res.json();
        if (res.ok) {
          router.push('/admin');
        } else {
          setError(data.error || 'حدث خطأ أثناء منح الصلاحيات');
        }
      } catch (err) {
        setError('تعذر الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    } else {
      setError('كلمة المرور غير صحيحة يا مدير');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden text-right" dir="rtl">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--brand-primary)]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[440px] z-10">
        <div className="card-glass p-10 rounded-[40px] border border-white/10 shadow-[var(--shadow-lg)] animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[var(--brand-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <img src="https://img.icons8.com/fluency/256/lock.png" width={44} height={44} alt="Secret" />
            </div>
            <h1 className="text-[1.8rem] font-black text-[var(--text-primary)] mb-2">الباب السري</h1>
            <p className="text-[0.95rem] text-[var(--text-secondary)] font-medium">أدخل الرمز السري للدخول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleAccess} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full text-center text-[1.2rem] font-black tracking-[0.5em] transition-all focus:scale-[1.02]"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-[0.85rem] font-black text-center animate-bounce">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 rounded-[22px] text-[1.1rem] font-black shadow-[0_10px_25px_rgba(108,60,225,0.4)] flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <img src="https://img.icons8.com/fluency/256/key.png" width={22} height={22} className="brightness-0 invert" alt="Enter" />
                  فتح الباب السري
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-[0.8rem] text-[var(--text-tertiary)] font-bold opacity-30">
          منطقة محظورة - المطورين فقط
        </p>
      </div>

      <style jsx global>{`
        .input-field {
          background: var(--bg-input);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          color: var(--text-primary);
          outline: none;
        }
        .input-field:focus {
          border-color: var(--brand-primary);
        }
        .card-glass {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
