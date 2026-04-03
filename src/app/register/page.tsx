"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
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
        setIsSuccess(true);
        setUserEmail(formData.email);
      } else {
        alert(data.error || "فشل التسجيل");
      }
    } catch (e) {
      alert("فشل الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fields = [
    { name: 'username', label: 'اسم المستخدم', type: 'text', icon: '👤', placeholder: 'اسم المستخدم', dir: 'ltr' },
    { name: 'email', label: 'البريد الإلكتروني', type: 'email', icon: '📧', placeholder: 'name@example.com', dir: 'ltr' },
    { name: 'firstName', label: 'الاسم الأول', type: 'text', icon: '👤', placeholder: 'محمد', dir: 'rtl', half: true },
    { name: 'lastName', label: 'الاسم الأخير', type: 'text', icon: '👤', placeholder: 'العتيبي', dir: 'rtl', half: true },
    { name: 'phone', label: 'الهاتف', type: 'tel', icon: '📱', placeholder: '+966 5XX XXX XXXX', dir: 'ltr' },
    { name: 'password', label: 'كلمة المرور', type: 'password', icon: '🔒', placeholder: '••••••••••••', dir: 'ltr' },
    { name: 'confirmPassword', label: 'تأكيد كلمة المرور', type: 'password', icon: '🔐', placeholder: '••••••••••••', dir: 'ltr' },
  ];

  return (
    <>
      <Navbar />
      <main dir="rtl" className="hero-bg" style={{ minHeight: '100vh', paddingTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
          
          {isSuccess ? (
            <div className="animate-fade-in-up" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', background: 'var(--bg-card)', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--brand-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2.5rem' }}>✅</div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>افحص بريدك الإلكتروني!</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                لقد تم إرسال رابط تفعيل الحساب إلى البريد الإلكتروني: <br/>
                <strong style={{ color: 'var(--brand-primary)' }}>{userEmail}</strong>
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                يرجى الضغط على الرابط الموجود في الرسالة لتتمكن من تسجيل الدخول إلى لوحة التحكم. <br/>
                (إذا لم تجد الرسالة في الوارد، يرجى تفقد ملف "الرسائل غير المرغوب فيها" أو Spam).
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/login" className="btn-primary" style={{ padding: '0.8rem 2.5rem' }}>الذهاب لصفحة الدخول</Link>
                <button onClick={() => setIsSuccess(false)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>تعديل البيانات</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
              
              {/* Form */}
              <div className="animate-fade-in-up">
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>هل أنت جاهز؟ 🚀</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  افتح حساباً في <strong style={{ color: 'var(--brand-primary)' }}>تفاعلكم</strong> الآن! وابدأ في رحلة نمو حساباتك. تفصلك خطوة واحدة عن أفضل تجربة تسويق عربية.
                </p>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {fields.map((field, i) => {
                    if (field.half) return null;
                    return (
                      <div key={i}>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{field.icon}</span>
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
                    );
                  })}

                  {/* First/Last name row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {fields.filter(f => f.half).map((field, i) => (
                      <div key={i}>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{field.icon}</span>
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
                  </div>

                  <button 
                    type="submit" 
                    className="btn-dark" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ جاري التحقق والتسجيل...' : 'سجّل الآن في تفاعلكم'}
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
                    <span style={{ fontSize: '6rem' }}>📈</span>
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
