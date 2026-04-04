"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const platformIcons: Record<string, string> = {
  Instagram: 'https://img.icons8.com/fluency/256/instagram-new.png',
  TikTok: 'https://img.icons8.com/fluency/256/tiktok.png',
  YouTube: 'https://img.icons8.com/fluency/256/youtube-play.png',
  Twitter: 'https://img.icons8.com/fluency/256/twitter.png',
  Facebook: 'https://img.icons8.com/fluency/256/facebook-new.png',
  Snapchat: 'https://img.icons8.com/fluency/256/snapchat.png',
  Telegram: 'https://img.icons8.com/fluency/256/telegram-app.png',
  LinkedIn: 'https://img.icons8.com/fluency/256/linkedin.png',
  Spotify: 'https://img.icons8.com/fluency/256/spotify.png',
  Discord: 'https://img.icons8.com/fluency/256/discord-logo.png',
  Twitch: 'https://img.icons8.com/fluency/256/twitch.png',
  Pinterest: 'https://img.icons8.com/fluency/256/pinterest.png',
  Reddit: 'https://img.icons8.com/fluency/256/reddit.png',
  Google: 'https://img.icons8.com/fluency/256/google-logo.png',
  SoundCloud: 'https://img.icons8.com/fluency/256/soundcloud.png',
  Threads: 'https://img.icons8.com/fluency/256/threads.png',
};

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        body: JSON.stringify(formData)
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
    { name: 'email', label: 'البريد الإلكتروني', type: 'email', icon: 'https://img.icons8.com/parakeet/256/envelope.png', placeholder: 'name@example.com', dir: 'ltr' },
    { name: 'password', label: 'كلمة المرور', type: 'password', icon: 'https://img.icons8.com/parakeet/256/lock.png', placeholder: '••••••••••••', dir: 'ltr' },
    { name: 'confirmPassword', label: 'تأكيد كلمة المرور', type: 'password', icon: 'https://img.icons8.com/parakeet/256/checked-checkbox.png', placeholder: '••••••••••••', dir: 'ltr' },
  ];

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg" style={{ minHeight: '100vh', paddingTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
            
            {/* Form */}
            <div className="animate-fade-in-up">
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="https://img.icons8.com/parakeet/256/rocket.png" width={40} height={40} />
                هل أنت جاهز؟
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                افتح حساباً في <strong style={{ color: 'var(--brand-primary)' }}>تفاعلكم</strong> الآن! وابدأ في رحلة نمو حساباتك. تفصلك خطوة واحدة عن أفضل تجربة تسويق عربية.
              </p>

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {fields.map((field, i) => (
                  <div key={i}>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px' }}>
                        <img src={field.icon} width={20} height={20} />
                      </span>
                      <input 
                        type={field.type} 
                        name={field.name}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        required
                        className="input-field" 
                        placeholder={field.placeholder}
                        dir={field.dir}
                        style={{ paddingRight: '3.2rem', background: 'var(--bg-card)', border: '1.5px solid var(--border-color)' }} 
                      />
                    </div>
                  </div>
                ))}

                <button 
                  type="submit" 
                  className="btn-dark" 
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', borderRadius: 'var(--radius-lg)' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <img src="https://img.icons8.com/parakeet/256/hourglass.png" width={24} height={24} className="animate-spin" style={{ filter: 'brightness(0) invert(1)' }} />
                      جاري التحقق والتسجيل...
                    </>
                  ) : 'سجّل الآن في تفاعلكم'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                هل لديك حساب؟ <Link href="/login" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none' }}>تسجيل الدخول</Link>
              </div>
            </div>

            {/* Right Graphics */}
            <div className="animate-slide-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <div style={{ width: '300px', height: '300px', borderRadius: '50%', background: 'var(--gradient-primary)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 60px rgba(108,60,225,0.3)' }}>
                  <img src="https://img.icons8.com/parakeet/256/chart.png" width={120} height={120} style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                
                {/* Floating icons */}
                {[
                  { url: platformIcons.Instagram, top: '10%', left: '-10%', delay: '0s' },
                  { url: platformIcons.TikTok, top: '5%', right: '-5%', delay: '0.5s' },
                  { url: platformIcons.YouTube, top: '20%', left: '-15%', delay: '1s' },
                  { url: platformIcons.Facebook, bottom: '5%', right: '-10%', delay: '1.5s' },
                  { url: platformIcons.Twitter, top: '40%', left: '-20%', delay: '2s' },
                  { url: platformIcons.Snapchat, top: '35%', right: '-15%', delay: '2.5s' },
                ].map((item, i) => (
                  <div key={i} className="animate-float" style={{ 
                    position: 'absolute', top: item.top, left: item.left, right: item.right, bottom: item.bottom,
                    animationDelay: item.delay, width: '58px', height: '58px', borderRadius: '18px', 
                    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                    border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', boxShadow: 'var(--shadow-lg)' 
                  }}>
                    <img src={item.url} alt="App" width={32} height={32} style={{ objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
