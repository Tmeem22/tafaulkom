"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

/* ============================================================
   DATA
============================================================ */
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

const services = [
  { name: 'تويتر (X)', desc: 'زيادة المتابعين والإعجابات وإعادة التغريد للحصول على تفاعل حقيقي ونمو قوي.', icon: 'https://img.icons8.com/fluency/256/twitter.png' },
  { name: 'انستقرام', desc: 'متابعين حقيقيين، إعجابات، مشاهدات وريلز لرفع ظهور حسابك بشكل آمن.', icon: 'https://img.icons8.com/fluency/256/instagram-new.png' },
  { name: 'تيك توك', desc: 'متابعين، مشاهدات ولايكات لفيديوهاتك لزيادة الظهور والوصول لصفحة For You.', icon: 'https://img.icons8.com/fluency/256/tiktok.png' },
  { name: 'يوتيوب', desc: 'مشتركين، مشاهدات وساعات مشاهدة لتحقيق الربح والانتشار على يوتيوب.', icon: 'https://img.icons8.com/fluency/256/youtube-play.png' },
  { name: 'فيسبوك', desc: 'متابعين صفحتك ومشاهدات المنشورات والتفاعل لتحسين ظهورك على فيسبوك.', icon: 'https://img.icons8.com/fluency/256/facebook-new.png' },
  { name: 'سناب شات', desc: 'زيادة مشاهدات القصص والمتابعين على سناب شات لتفاعل أعلى ونمو أسرع.', icon: 'https://img.icons8.com/fluency/256/snapchat.png' },
  { name: 'تيليجرام', desc: 'أعضاء ومشاهدات حقيقية لقناتك أو مجموعتك لزيادة قوة وصول المحتوى.', icon: 'https://img.icons8.com/fluency/256/telegram-app.png' },
  { name: 'لينكدإن', desc: 'تقوية حضورك المهني بزيادة المتابعين والتفاعل والمشاهدات على لينكدإن.', icon: 'https://img.icons8.com/fluency/256/linkedin.png' },
  { name: 'سبوتيفاي', desc: 'تعزيز حضورك الموسيقي بزيادة الاستماعات والمتابعين على سبوتيفاي.', icon: 'https://img.icons8.com/fluency/256/spotify.png' },
  { name: 'ديسكورد', desc: 'تعزيز عدد الأعضاء والتفاعل في خادم الديسكورد لبناء مجتمع نشط.', icon: 'https://img.icons8.com/fluency/256/discord-logo.png' },
];

// Testimonials will be fetched from the API
const initialTestimonials = [
  { name: 'سارة الأحمدي', text: 'صراحة سهولة بالتعامل، مجرد ما طلبت تم التنفيذ بسلاسة. أنصح بتجربتهم لو تدورون سرعة.', rating: 5 },
  { name: 'أحمد المالكي', text: 'حبيت توفر خيارات الدفع وتنوع الخدمات. الأسعار تعتبر تنافسية جداً وتوفر وقت وجهد.', rating: 5 },
  { name: 'نورة العتيبي', text: 'الدعم الفني مره متجاوبين صراحة، كان عندي طلب تعديل على الرابط وتجاوبوا معي بثواني.', rating: 5 },
  { name: 'محمد الدوسري', text: 'من تجربة، جودة المتابعين بالخدمات المضمونة فعلاً ثابته وما تنقص كثير مقارنة بالباقين.', rating: 5 },
  { name: 'ريم الحربي', text: 'دائماً اعتمد عليهم في تسويق حسابات متجري، ما شاء الله سرعة التنفيذ تبيض الوجه قدام العملاء.', rating: 5 },
  { name: 'خالد العنزي', text: 'الربط البرمجي API ريحني كثير. المستندات واضحة والرد من السيرفر سريع بدون أي تأخير.', rating: 5 },
];

const faqs = [
  { q: 'ما هو تفاعلكم؟', a: 'تفاعلكم هو أكبر منصة عربية لخدمات التسويق عبر وسائل التواصل الاجتماعي. نقدم حلول تسويقية كاملة لزيادة المتابعين وتحسين التفاعل وتعزيز نمو الحسابات بسرعة وأمان على جميع المنصات الكبرى.' },
  { q: 'كيف يعمل تفاعلكم؟', a: 'ببساطة: سجّل حساب مجاني → اشحن رصيدك بطريقة الدفع المناسبة → اختر الخدمة والمنصة → أدخل رابط حسابك والكمية → اضغط تأكيد الطلب! وسيبدأ التنفيذ خلال ثوانٍ معدودة.' },
  { q: 'ما هي فوائد استخدام تفاعلكم؟', a: 'أسعار تبدأ من $0.001 لكل ألف، تنفيذ فوري للطلبات، دعم فني متاح 24/7، أكثر من 10,000 خدمة متنوعة، واجهة API متقدمة للمطورين والموزعين، وضمان جودة الخدمة.' },
  { q: 'هل يمكنني إعادة بيع الخدمات (Reseller)؟', a: 'بالتأكيد! يمكنك استخدام واجهة الـ API الخاصة بنا لربط لوحتك الخاصة بمنصتنا وإعادة بيع جميع خدماتنا بأسعارك أنت. كل ما تحتاجه هو مفتاح API وستبدأ الطلبات تتحول إلينا تلقائياً.' },
];

/* ============================================================
   ANIMATED COUNTER
============================================================ */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loginLoading, setLoginLoading] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState({ users: 0, orders: 0 });

  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast("Welcome back! Login successful.", "success");
        router.push('/dashboard');
      } else {
        showToast(data.error || "فشل تسجيل الدخول", "error");
      }
    } catch (e) {
      showToast("فشل الاتصال بخادم السيرفر", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main dir="rtl">
        {/* ====================== HERO SECTION ====================== */}
        <section className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '90px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
              
              {/* Left: Content */}
              <div className="animate-fade-in-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex' }}>
                    {[platformIcons.Instagram, platformIcons.TikTok, platformIcons.YouTube, platformIcons.Twitter, platformIcons.Facebook].map((icon, i) => (
                      <img key={i} src={icon} alt="Platform" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--bg-primary)', marginRight: i > 0 ? '-8px' : '0', position: 'relative', zIndex: 5-i }} />
                    ))}
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>انضم لـ <strong style={{ color: 'var(--brand-primary)' }}><AnimatedCounter target={stats.users} suffix={stats.users > 1000 ? "K+" : "+"} /></strong> عميل في <span style={{ color: 'var(--brand-primary)' }}>تفاعلكم</span></span>
                </div>

                <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 950, lineHeight: 1.05, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                  منصة <span style={{ color: 'var(--brand-primary)' }}>تفاعلكم</span> <br/>
                  <span className="gradient-text">لنمو حساباتك.</span>
                </h1>

                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '580px' }}>
                  أكبر منصة عربية لخدمات التسويق الرقمي بلمسة عالمية. نقدم حلولاً ذكية لزيادة التفاعل على جميع المنصات بأقل التكاليف وأفضل النتائج المضمونة.
                </p>

                <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                  <Link href="/register" className="btn-primary" style={{ padding: '1.1rem 3.5rem', fontSize: '1.1rem', boxShadow: '0 10px 40px rgba(108,60,225,0.4)', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img src="https://img.icons8.com/parakeet/256/rocket.png" width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />
                    ابدأ الآن مجاناً
                  </Link>
                  <Link href="/services" className="btn-secondary" style={{ padding: '1.1rem 2.2rem', borderRadius: 'var(--radius-full)' }}>
                    قائمة الخدمات
                  </Link>
                </div>

                {/* Floating Social Icons Container */}
                <div style={{ position: 'relative', width: '100%', height: '140px', display: 'flex', alignItems: 'center', gap: '1.5rem', overflow: 'hidden', padding: '1rem 0' }}>
                  {[
                    { name: 'Instagram', icon: platformIcons.Instagram },
                    { name: 'TikTok', icon: platformIcons.TikTok },
                    { name: 'YouTube', icon: platformIcons.YouTube },
                    { name: 'Snapchat', icon: platformIcons.Snapchat },
                    { name: 'X', icon: platformIcons.Twitter },
                    { name: 'Facebook', icon: platformIcons.Facebook },
                  ].map((item, i) => (
                    <div key={i} className="animate-float" style={{ 
                      animationDelay: `${i * 0.2}s`, display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(255,255,255,0.03)', padding: '0.6rem 1.2rem', borderRadius: '14px',
                      border: '1px solid var(--border-color)', backdropFilter: 'blur(5px)'
                    }}>
                      <img src={item.icon} alt={item.name} width={20} height={20} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Login Form */}
              <div className="animate-slide-right stagger-2" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)' }}>
                     <span style={{ background: 'var(--gradient-primary)', color: 'white', padding: '0.5rem 1.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 800, boxShadow: '0 8px 25px rgba(108,60,225,0.4)', display: 'flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap' }}>
                       <img src="https://img.icons8.com/parakeet/256/globe.png" width={18} height={18} style={{ filter: 'brightness(0) invert(1)' }} />
                       أكبر منصة عربية
                     </span>
                   </div>

                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>تسجيل الدخول</h2>
                  <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>ادخل لحسابك وابدأ بتنفيذ الطلبات</p>

                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} autoComplete="off">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>البريد الإلكتروني</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                          <img src="https://img.icons8.com/parakeet/256/envelope.png" width={22} height={22} />
                        </span>
                        <input 
                          type="text" 
                          required
                          className="input-field" 
                          placeholder="البريد الإلكتروني" 
                          style={{ paddingRight: '3.2rem', height: '54px', borderRadius: '14px' }} 
                          value={login} 
                          onChange={e => setLogin(e.target.value)} 
                          autoComplete="email" 
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>كلمة المرور</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                          <img src="https://img.icons8.com/parakeet/256/lock.png" width={20} height={20} />
                        </span>
                        <input type="password" className="input-field" placeholder="••••••••••" style={{ paddingRight: '2.8rem' }} dir="ltr" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                      </div>
                    </div>

                    <button type="submit" disabled={loginLoading} className="btn-dark" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loginLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                      {loginLoading ? '⏳ جاري التحقق...' : (
                        <>
                          <img src="https://img.icons8.com/parakeet/256/key.png" width={20} height={20} />
                          تسجيل الدخول
                        </>
                      )}
                    </button>
                  </form>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginTop: '1rem' }}>
                    <Link href="/forgot-username" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>استعادة الحساب</Link>
                    <Link href="/reset-password" style={{ color: 'var(--brand-primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>نسيت كلمة المرور؟</Link>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                    ليس لديك حساب؟ <Link href="/register" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none' }}>سجّل الآن</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== STATS SECTION ====================== */}
        <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              تمكين وسائل التواصل الاجتماعي
              <br />
              <span className="gradient-text">بخدمات SMM الحقيقية</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
              <div className="stat-card animate-fade-in-up stagger-1">
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <img src="https://img.icons8.com/parakeet/256/clock.png" width={48} height={48} />
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>طلب جديد كل</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>ثانية</p>
              </div>
              <div className="stat-card animate-fade-in-up stagger-2">
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <img src="https://img.icons8.com/parakeet/256/checkmark.png" width={48} height={48} />
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>طلب مكتمل</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }} dir="ltr">+<AnimatedCounter target={stats.orders} /></p>
              </div>
              <div className="stat-card animate-fade-in-up stagger-3">
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <img src="https://img.icons8.com/parakeet/256/money.png" width={48} height={48} />
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>الأسعار تبدأ من</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--brand-primary)' }} dir="ltr">$0.001</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/register" className="btn-primary" style={{ padding: '1.1rem 3.5rem', fontSize: '1.1rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="https://img.icons8.com/parakeet/256/rocket.png" width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />
                سجّل الآن وابدأ
              </Link>
            </div>
          </div>
        </section>

        {/* ====================== FEATURES SECTION ====================== */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="features-grid">
              {/* Left: Text */}
              <div>
                <span className="section-badge">نبذة عنا</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginTop: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  تفاعلكم يقدّم أفضل حلول التسويق عبر وسائل{' '}
                  <span className="gradient-text">التواصل الاجتماعي</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1rem', marginBottom: '2rem' }}>
                  يعتبر تفاعلكم أحد أفضل منصات التسويق في العالم العربي، حيث يقدّم خدمات سريعة ومناسبة وآمنة تساعد العلامات التجارية والوكالات والمؤثرين على تعزيز حضورهم وزيادة التفاعل الحقيقي وتحقيق نتائج مضمونة.
                </p>
                <Link href="/services" className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img src="https://img.icons8.com/parakeet/256/flash-on.png" width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
                  استكشف خدمات تفاعلكم
                </Link>
              </div>

              {/* Right: Feature Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                {[
                  { icon: 'https://img.icons8.com/parakeet/256/fast-forward.png', title: 'أسرع لوحة SMM', desc: 'معالجة فورية للطلبات مع تتبع مباشر لضمان أسرع نتائج بدون أي تأخير.' },
                  { icon: 'https://img.icons8.com/parakeet/256/sale.png', title: 'أرخص لوحة SMM', desc: 'أسعار منخفضة جداً مع أعلى مستويات النمو والتفاعل بتكلفة تنافسية.' },
                  { icon: 'https://img.icons8.com/parakeet/256/shield.png', title: 'آمن 100% ومضمون', desc: 'جميع الخدمات آمنة وخالية من المخاطر مع تسليم عضوي يحافظ على سلامة حساباتك.' },
                  { icon: 'https://img.icons8.com/parakeet/256/headset.png', title: 'دعم على مدار الساعة', desc: 'فريق الدعم متواجد 24/7 لمساعدتك في الطلبات والمشكلات في أي وقت.' },
                ].map((f, i) => (
                  <div key={i} className="feature-card">
                    <span style={{ display: 'block', marginBottom: '0.75rem' }}>
                      <img src={f.icon} alt={f.title} width={48} height={48} />
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================== PLATFORM MARQUEE ====================== */}
        <section style={{ padding: '3rem 0', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              أكثر من <span className="gradient-text">10,000</span> خدمة من خدمات التواصل الاجتماعي
            </h2>
          </div>
          {/* Row 1 */}
          <div style={{ overflow: 'hidden', marginBottom: '0.75rem' }}>
            <div className="marquee-track">
              {[...Object.entries(platformIcons), ...Object.entries(platformIcons)].map(([name, icon], i) => (
                <span key={i} className="platform-badge" style={{ margin: '0 0.35rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <img src={icon} alt={name} width={20} height={20} /> {name}
                </span>
              ))}
            </div>
          </div>
          {/* Row 2 (reverse) */}
          <div style={{ overflow: 'hidden' }}>
            <div className="marquee-track-reverse">
              {[...Object.entries(platformIcons), ...Object.entries(platformIcons)].reverse().map(([name, icon], i) => (
                <span key={i} className="platform-badge" style={{ margin: '0 0.35rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <img src={icon} alt={name} width={20} height={20} /> {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== HOW IT WORKS ====================== */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <span className="section-badge">كيف يعمل</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: '3rem', color: 'var(--text-primary)' }}>
              كيف يعمل <span className="gradient-text">تفاعلكم</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                { num: '01', title: 'التسجيل في تفاعلكم', desc: 'أنشئ حسابك مجاناً وابدأ باستخدام منصتنا لإدارة طلبات التسويق بسهولة.', icon: 'https://img.icons8.com/parakeet/256/registration-form.png' },
                { num: '02', title: 'شحن الرصيد', desc: 'قم بإيداع رصيد من خلال طرق الدفع المتاحة وابدأ في تنفيذ طلباتك بسرعة وأمان.', icon: 'https://img.icons8.com/parakeet/256/card-exchange.png' },
                { num: '03', title: 'ابدأ الطلبات', desc: 'اختر الخدمة وأدخل التفاصيل المطلوبة وقدّم الطلب لتحصل على نمو حقيقي في حساباتك.', icon: 'https://img.icons8.com/parakeet/256/rocket.png' },
              ].map((step, i) => (
                <div key={i} className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', fontSize: '0.9rem', fontWeight: 900, color: 'white' }}>
                    {step.num}
                  </div>
                  <span style={{ display: 'block', marginBottom: '1rem' }}>
                    <img src={step.icon} alt={step.title} width={64} height={64} style={{ display: 'inline-block' }} />
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== SERVICES GRID ====================== */}
        <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <span className="section-badge">خدمات تفاعلكم</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              خدماتنا <span className="gradient-text">الاستثنائية</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
              اكتشف مجموعة واسعة من خدمات التسويق المصممة لزيادة المتابعين والتفاعل وتحسين الظهور بسرعة وموثوقية.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {services.map((svc, i) => (
                <Link href="/services" key={i} style={{ textDecoration: 'none' }}>
                  <div className="service-card">
                    <span style={{ display: 'block', marginBottom: '1rem', textAlign: 'center' }}>
                      <img src={svc.icon} alt={svc.name} width={48} height={48} style={{ display: 'inline-block' }} />
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{svc.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{svc.desc}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1.2rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
                      استكشف المزيد <img src="https://img.icons8.com/parakeet/256/left.png" width={14} height={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== RESULTS / CTA SECTION ====================== */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="results-grid">
              <div>
                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '2.5rem 2rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <img src="https://img.icons8.com/parakeet/256/smartphone.png" width={80} height={80} style={{ display: 'block', margin: '0 auto 1.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>شاهد نمو مستخدمينا</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                        <AnimatedCounter target={stats.orders} />
                      </span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                        <img src="https://img.icons8.com/parakeet/256/package.png" width={16} height={16} /> طلبات مكتملة
                      </p>
                    </div>
                    <div style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-success)' }}>
                        <AnimatedCounter target={stats.users} />
                      </span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                        <img src="https://img.icons8.com/parakeet/256/user.png" width={16} height={16} /> مستخدم نشط
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', color: 'white' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>نتائج مثبتة من تفاعلكم</h3>
                  <p style={{ lineHeight: 1.8, opacity: 0.9, marginBottom: '2rem' }}>
                    نقدم حلول تسويق فعّالة تساعد المستخدمين والشركات على زيادة المتابعين وتحسين التفاعل وتعزيز نمو حسابات وسائل التواصل الاجتماعي بسرعة وأمان.
                  </p>
                  <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2.5rem', borderRadius: 'var(--radius-full)', background: 'white', color: '#6C3CE1', fontWeight: 800, textDecoration: 'none', fontSize: '1rem' }}>
                    <img src="https://img.icons8.com/parakeet/256/star.png" width={24} height={24} />
                    ابدأ رحلتك الآن!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== FAQ + HELP ====================== */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }} className="faq-grid">
              
              {/* Help Card */}
              <div>
                <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-xl)', padding: '3.5rem 2rem', color: 'white', textAlign: 'center' }}>
                  <img src="https://img.icons8.com/parakeet/256/headset.png" width={80} height={80} style={{ display: 'block', margin: '0 auto 1.5rem', filter: 'brightness(0) invert(1)' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>هل تحتاج مساعدة؟</h3>
                  <p style={{ opacity: 0.9, lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
                    فريق الخبراء لدينا جاهز لمساعدتك والإجابة على جميع استفساراتك حول تفاعلكم.
                  </p>
                  <Link href="/register" style={{ display: 'inline-block', padding: '0.85rem 2rem', borderRadius: 'var(--radius-full)', background: 'white', color: '#6C3CE1', fontWeight: 800, textDecoration: 'none' }}>
                    تحدث مع خبرائنا
                  </Link>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <span className="section-badge">الأسئلة الشائعة</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '1rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>أي سؤال؟</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {faqs.map((faq, i) => (
                    <div key={i} className="faq-item">
                      <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        <span>{faq.q}</span>
                        <span style={{ fontSize: '1.2rem', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>⊕</span>
                      </div>
                      {openFaq === i && (
                        <div className="faq-answer">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Responsive Overrides */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .hero-grid, .features-grid, .results-grid, .faq-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid > div:last-child {
            order: -1;
          }
        }
      `}</style>
    </>
  );
}
