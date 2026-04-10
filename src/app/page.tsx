"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Faq from '@/components/Faq';

const services = [
  { name: 'متابعين انستقرام', icon: 'https://img.icons8.com/fluency/256/instagram-new.png', price: '0.10', category: 'Instagram' },
  { name: 'لايكات تيك توك', icon: 'https://img.icons8.com/fluency/256/tiktok.png', price: '0.05', category: 'TikTok' },
  { name: 'مشاهدات يوتيوب', icon: 'https://img.icons8.com/fluency/256/youtube-play.png', price: '1.20', category: 'YouTube' },
  { name: 'رسم تويتر (X)', icon: 'https://img.icons8.com/fluency/256/twitter.png', price: '0.40', category: 'Twitter' },
  { name: 'تفاعل سناب شات', icon: 'https://img.icons8.com/fluency/256/snapchat.png', price: '0.80', category: 'Snapchat' },
  { name: 'أعضاء تيليجرام', icon: 'https://img.icons8.com/fluency/256/telegram-app.png', price: '0.15', category: 'Telegram' },
];

export default function Home() {
  const [stats, setStats] = useState({ users: 0, orders: 0 });
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is already logged in to redirect them to dashboard
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          window.location.href = '/dashboard';
        }
      })
      .catch(() => {});

    // Fetch Real Stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats fetch error:", err));

    // Fetch Real Testimonials/Reviews
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Reviews fetch error:", err));
  }, []);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="overflow-hidden">
        
        {/* Hero Section */}
        <section className="hero-bg min-h-[90vh] flex items-center relative pt-[100px]">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-block py-2 px-5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-black text-[0.85rem] mb-6 border border-[var(--brand-primary)]/20 shadow-sm animate-pulse">
                🚀 منصة تزويد الخدمات الـ SMM الأسرع في الشرق الأوسط
              </span>
              <h1 className="text-[3.5rem] md:text-[4.5rem] font-black text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight">
                ارتقِ بحضورك <br />
                <span className="text-gradient">الرقمي بجنون</span>
              </h1>
              <p className="text-[1.15rem] text-[var(--text-secondary)] mb-10 leading-relaxed max-w-[540px] font-medium">
                تفاعلكم هي وجهتك الأولى للحصول على أفضل خدمات التواصل الاجتماعي بأسعار الجملة. جودة حقيقية، سرعة برقية، ودعم فني متواصل.
              </p>
              <div className="flex gap-5 flex-wrap">
                <Link href="/register" className="btn-primary p-5 px-10 text-[1.1rem] font-black rounded-[var(--radius-lg)] shadow-[0_10px_30px_rgba(108,60,225,0.4)] transition-all hover:scale-105 active:scale-95 no-underline flex items-center gap-3">
                  <img src="https://img.icons8.com/fluency/256/rocket.png" width={24} height={24} className="brightness-0 invert" alt="صاروخ" /> ابدأ الآن مجاناً
                </Link>
                <Link href="/services" className="btn-secondary p-5 px-10 text-[1.1rem] font-black rounded-[var(--radius-lg)] border-2 border-[var(--border-color)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-card)] no-underline flex items-center gap-3">
                   عرض الخدمات
                </Link>
              </div>
              
              <div className="mt-12">
                <p className="text-[1rem] font-bold text-[var(--text-tertiary)] flex items-center gap-2">
                  <span className="flex">
                    {[1,2,3,4,5].map(i => <img key={i} src="https://img.icons8.com/fluency/256/star.png" width={18} height={18} alt="star" />)}
                  </span>
                  موثوق من قبل عملاء تفاعلكم الحقيقيين
                </p>
              </div>
            </div>

            <div className="relative animate-slide-right hidden lg:block">
              <div className="rounded-[40px] overflow-hidden border-[2px] border-[var(--border-color)] shadow-[var(--shadow-lg)] relative bg-[var(--bg-card)] group">
                <img src="/hero.png" alt="SMM Dashboard Preview" className="w-full h-auto block transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[var(--bg-card)] border-y border-[var(--border-color)]">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'طلب حقيقي', value: stats.orders, icon: 'https://img.icons8.com/fluency/256/list.png' },
              { label: 'عميل مسجل', value: stats.users, icon: 'https://img.icons8.com/fluency/256/user-group-man-man.png' },
              { label: 'خدمة نشطة', value: '4,200', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
              { label: 'دعم فني', value: '24/7', icon: 'https://img.icons8.com/fluency/256/headset.png' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-[22px] bg-[var(--bg-secondary)] mx-auto mb-6 flex items-center justify-center transition-all group-hover:bg-[var(--brand-primary)] group-hover:rotate-6">
                  <img src={stat.icon} width={32} height={32} className="group-hover:brightness-0 group-hover:invert" alt={stat.label} />
                </div>
                <h3 className="text-[2.2rem] font-black text-[var(--text-primary)] mb-1 tracking-tight">
                  {stat.value.toLocaleString()}
                </h3>
                <p className="text-[0.9rem] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Services */}
        <section className="py-32 relative">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-[2.8rem] font-black text-[var(--text-primary)] mb-5">أبرز خدماتنا الرائجة</h2>
              <p className="text-[1.1rem] text-[var(--text-secondary)] font-medium max-w-[700px] mx-auto">
                وفرنا لك قائمة مختارة من أكثر الخدمات طلباً، بجودة عالية وأسعار جملة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s, i) => (
                <div key={i} className="card p-8 rounded-[32px] group hover:scale-[1.03] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[var(--border-color)] bg-[var(--bg-card)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-all"></div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-[20px] bg-[var(--bg-secondary)] flex items-center justify-center group-hover:rotate-12 transition-all">
                      <img src={s.icon} width={34} height={34} alt={s.name} />
                    </div>
                    <span className="py-1.5 px-4 rounded-full bg-emerald-500/10 text-emerald-500 text-[0.8rem] font-black">نشط الآن</span>
                  </div>
                  <h4 className="text-[1.3rem] font-black text-[var(--text-primary)] mb-3">{s.name}</h4>
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-[0.85rem] font-bold text-[var(--text-tertiary)]">تبدأ من:</span>
                    <span className="text-[1.4rem] font-black text-[var(--brand-primary)]" dir="ltr">${s.price}</span>
                    <span className="text-[0.85rem] font-bold text-[var(--text-tertiary)]">/ 1,000</span>
                  </div>
                  <Link href={`/register?serviceId=${s.category}`} className="w-full py-4 rounded-[18px] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-black text-[0.95rem] no-underline flex items-center justify-center gap-3 transition-all group-hover:bg-[var(--brand-primary)] group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(108,60,225,0.3)]">
                    اطلب الآن <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real Testimonials Section */}
        {reviews.length > 0 && (
          <section className="py-32 bg-[var(--bg-secondary)]/30">
            <div className="max-w-[1280px] mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-[2.5rem] font-black text-[var(--text-primary)] mb-5">آراء عملاء تفاعلكم</h2>
                <p className="text-[1.1rem] text-[var(--text-secondary)] font-medium">تقييمات حقيقية من أشخاص جربوا خدماتنا.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((rev, i) => (
                  <div key={i} className="p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] shadow-sm">
                    <div className="flex items-center gap-1 mb-4">
                      {[1,2,3,4,5].map(star => (
                        <img 
                          key={star} 
                          src="https://img.icons8.com/fluency/256/star.png" 
                          width={16} height={16} 
                          className={star > rev.rating ? 'grayscale opacity-30' : ''} 
                          alt="star" 
                        />
                      ))}
                    </div>
                    <p className="text-[1.05rem] text-[var(--text-primary)] leading-relaxed mb-6 font-medium italic">"{rev.text || rev.review}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] font-bold text-[0.8rem]">
                        {rev.name ? rev.name[0] : 'U'}
                      </div>
                      <p className="text-[0.9rem] font-bold text-[var(--text-secondary)]">{rev.name || 'عميل موثق'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Faq />

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-primary)] z-[-1]"></div>
          <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
            <h2 className="text-[3rem] md:text-[4rem] font-black text-white mb-8 leading-tight">
              انضم إلى آلاف المسوقين <br /> الناجحين اليوم!
            </h2>
            <p className="text-white/80 text-[1.2rem] mb-12 max-w-[700px] mx-auto font-medium">
              لا تضيع وقتك، ابدأ الآن في تكبير حساباتك بأفضل الأدوات وأرخص الأسعار في السوق.
            </p>
            <Link href="/register" className="inline-block py-6 px-16 bg-white text-[var(--brand-primary)] font-black text-[1.2rem] rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all no-underline">
              سجل حسابك مجاناً الآن
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
