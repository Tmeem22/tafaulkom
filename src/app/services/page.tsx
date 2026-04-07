"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const platformIcons: Record<string, string> = {
  instagram: 'https://img.icons8.com/fluency/256/instagram-new.png',
  tiktok: 'https://img.icons8.com/fluency/256/tiktok.png',
  youtube: 'https://img.icons8.com/fluency/256/youtube-play.png',
  twitter: 'https://img.icons8.com/fluency/256/twitter.png',
  facebook: 'https://img.icons8.com/fluency/256/facebook-new.png',
  snapchat: 'https://img.icons8.com/fluency/256/snapchat.png',
  telegram: 'https://img.icons8.com/fluency/256/telegram-app.png',
  spotify: 'https://img.icons8.com/fluency/256/spotify.png',
};

const categories = [
  { name: 'الكل', key: 'all' },
  { name: 'Instagram', key: 'instagram', icon: platformIcons.instagram },
  { name: 'TikTok', key: 'tiktok', icon: platformIcons.tiktok },
  { name: 'YouTube', key: 'youtube', icon: platformIcons.youtube },
  { name: 'Twitter', key: 'twitter', icon: platformIcons.twitter },
  { name: 'Facebook', key: 'facebook', icon: platformIcons.facebook },
  { name: 'Snapchat', key: 'snapchat', icon: platformIcons.snapchat },
  { name: 'Telegram', key: 'telegram', icon: platformIcons.telegram },
  { name: 'Spotify', key: 'spotify', icon: platformIcons.spotify },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [allServices, setAllServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Format standard provider structure if needed, or just use raw:
          // Often providers return object or array. Assume standard SMM array structure
          const formatted = data.map((s: any) => ({
            id: s.service,
            platform: (s.category || '').split(' ')[0].toLowerCase(), // heuristic
            category: s.category,
            name: s.name,
            rate: parseFloat(s.rate),
            min: parseInt(s.min),
            max: parseInt(s.max),
            refill: s.refill === true || s.refill === '1',
          }));
          setAllServices(formatted);
        }
      } catch (err) {
        console.error("Failed to load generic services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filtered = activeCategory === 'all' 
    ? allServices 
    : allServices.filter(s => s.platform.includes(activeCategory) || (s.category && s.category.toLowerCase().includes(activeCategory)));

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-[90px] min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-12">
              <span className="section-badge">خدماتنا</span>
              <h1 className="text-[2.5rem] font-extrabold mt-4 text-[var(--text-primary)]">
                جميع <span className="gradient-text">الخدمات المتاحة</span>
              </h1>
              <p className="text-[var(--text-secondary)] max-w-[600px] mx-auto mt-4">
                اكتشف أكثر من 10,000 خدمة لجميع منصات التواصل الاجتماعي بأقل الأسعار.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 justify-center flex-wrap mb-12">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-[0.85rem] cursor-pointer transition-all border-[1.5px] ${
                    activeCategory === cat.key 
                      ? 'bg-[var(--gradient-cta)] text-white border-[var(--brand-primary)]' 
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--brand-primary)]'
                  }`}
                >
                  {cat.icon && (
                    <img src={cat.icon} alt={cat.name} className="w-5 h-5 object-contain" />
                  )}
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Services Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                      <th className="p-4 px-6 text-right text-[0.8rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">الرقم</th>
                      <th className="p-4 px-6 text-right text-[0.8rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">الخدمة</th>
                      <th className="p-4 px-6 text-center text-[0.8rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">السعر / 1K</th>
                      <th className="p-4 px-6 text-center text-[0.8rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">الحد الأدنى</th>
                      <th className="p-4 px-6 text-center text-[0.8rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">الحد الأقصى</th>
                      <th className="p-4 px-6 text-center text-[0.8rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">تعويض</th>
                      <th className="p-4 px-6 text-center text-[0.8rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center p-12">
                          <div className="flex flex-col items-center gap-4 text-[var(--text-secondary)]">
                            <img src="https://img.icons8.com/fluency/256/hourglass.png" width={40} height={40} className="animate-spin" alt="تحميل" />
                            <span className="font-bold">جاري جلب الخدمات...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.map((s, i) => (
                      <tr key={s.id} className="border-b border-[var(--border-color)] transition-colors hover:bg-[var(--bg-secondary)]/50">
                        <td className="p-4 px-6 text-[0.85rem] text-[var(--text-tertiary)] font-semibold">{s.id}</td>
                        <td className="p-4 px-6">
                          <span className="text-[0.9rem] font-semibold text-[var(--text-primary)]" dir="ltr">{s.name}</span>
                        </td>
                        <td className="p-4 px-6 text-center">
                          <span className="text-[0.9rem] font-extrabold text-[var(--brand-primary)]" dir="ltr">${s.rate.toFixed(2)}</span>
                        </td>
                        <td className="p-4 px-6 text-center text-[0.85rem] text-[var(--text-secondary)]">{s.min.toLocaleString()}</td>
                        <td className="p-4 px-6 text-center text-[0.85rem] text-[var(--text-secondary)]">{s.max.toLocaleString()}</td>
                        <td className="p-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[0.75rem] font-extrabold border ${
                            s.refill 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                              : 'bg-red-500/5 text-[var(--text-tertiary)] border-[var(--border-color)]'
                          }`}>
                            <img src={s.refill ? 'https://img.icons8.com/fluency/256/checkmark.png' : 'https://img.icons8.com/fluency/256/delete-sign.png'} width={14} height={14} alt={s.refill ? 'نعم' : 'لا'} />
                            {s.refill ? 'نعم' : 'لا'}
                          </span>
                        </td>
                        <td className="p-4 px-6 text-center">
                          <Link 
                            href={`/dashboard?serviceId=${s.id}`}
                            className="btn-primary py-1.5 px-4 text-[0.75rem] rounded-lg shadow-none"
                          >
                            اطلب الآن
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/register" className="btn-primary py-5 px-16 text-[1.1rem] rounded-full inline-flex items-center gap-3 shadow-[var(--shadow-lg)] transition-transform hover:scale-105 active:scale-95">
                <img src="https://img.icons8.com/fluency/256/rocket.png" width={24} height={24} className="brightness-0 invert" alt="صاروخ" />
                ابدأ رحلتك الآن
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
