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
      <main dir="rtl" style={{ paddingTop: '90px', minHeight: '100vh' }}>
        <section style={{ padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-badge">خدماتنا</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-primary)' }}>
                جميع <span className="gradient-text">الخدمات المتاحة</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0' }}>
                اكتشف أكثر من 10,000 خدمة لجميع منصات التواصل الاجتماعي بأقل الأسعار.
              </p>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    padding: '0.6rem 1.4rem', borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${activeCategory === cat.key ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                    background: activeCategory === cat.key ? 'var(--gradient-cta)' : 'var(--bg-card)',
                    color: activeCategory === cat.key ? 'white' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.6rem'
                  }}
                >
                  {cat.icon && (
                    <img src={cat.icon} alt={cat.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                  )}
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Services Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>الرقم</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>الخدمة</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>السعر / 1K</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>الحد الأدنى</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>الحد الأقصى</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>تعويض</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>جاري جلب الخدمات من المزود... ⏳</td></tr>
                    ) : filtered.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{s.id}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }} dir="ltr">{s.name}</span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-primary)' }} dir="ltr">${s.rate.toFixed(2)}</span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.min.toLocaleString()}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.max.toLocaleString()}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: s.refill ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: s.refill ? 'var(--brand-success)' : 'var(--brand-danger)' }}>
                            {s.refill ? '✓ نعم' : '✕ لا'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem' }}>
                سجّل الآن وابدأ الطلبات 🚀
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
