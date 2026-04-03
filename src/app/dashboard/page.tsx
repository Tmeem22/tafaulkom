"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: '🛒', active: true },
  { label: 'طلباتي', href: '/dashboard/orders', icon: '📋' },
  { label: 'خدماتنا', href: '/services', icon: '⚡' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: '💳' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: '🎧' },
  { label: 'API', href: '/api-docs', icon: '🔗' },
];

const platformIcons: Record<string, string> = {
  'سناب': 'https://img.icons8.com/fluency/48/snapchat.png',
  'انستقرام': 'https://img.icons8.com/fluency/48/instagram-new.png',
  'تيك توك': 'https://img.icons8.com/fluency/48/tiktok.png',
  'يوتيوب': 'https://img.icons8.com/fluency/48/youtube-play.png',
  'تويتر': 'https://img.icons8.com/fluency/48/twitter.png',
  'فيسبوك': 'https://img.icons8.com/fluency/48/facebook-new.png',
  'تيليجرام': 'https://img.icons8.com/fluency/48/telegram-app.png',
  'ديسكورد': 'https://img.icons8.com/fluency/48/discord-logo.png',
  'لينكدإن': 'https://img.icons8.com/fluency/48/linkedin.png',
  'سبوتيفاي': 'https://img.icons8.com/fluency/48/spotify.png',
  'Kick': 'https://img.icons8.com/fluency/48/kick.png',
  'Threads': 'https://img.icons8.com/fluency/48/threads.png',
};

const getIcon = (name: string) => {
  for (const [key, val] of Object.entries(platformIcons)) {
    if (name.includes(key)) return val;
  }
  return 'https://img.icons8.com/fluency/48/shopping-cart.png';
};

export default function Dashboard() {
  const [servicesData, setServicesData] = useState<Record<string, { name: string; rate: number; id: string | number }[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | number>('');
  const [quantity, setQuantity] = useState(1000);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          const grouped: Record<string, any[]> = {};
          data.forEach(s => {
            if (!grouped[s.category]) {
              grouped[s.category] = [];
            }
            grouped[s.category].push({
              id: s.service,
              name: s.name,
              rate: parseFloat(s.rate),
            });
          });
          const catList = Object.keys(grouped);
          setServicesData(grouped);
          setCategories(catList);
          if (catList.length > 0) {
            setSelectedCategory(catList[0]);
            setSelectedServiceId(grouped[catList[0]][0]?.id || '');
          }
        }
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        if (data.balance !== undefined) {
          setBalance(data.balance);
        }
      } catch (e) {
        console.error("Failed to load user");
      }
    };
    fetchUser();
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) {
      setMessage({ type: 'error', text: 'الرجاء إدخال الرابط' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          serviceName: selectedService?.name,
          link,
          quantity,
          charge: totalCost,
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الطلب');
      }

      setMessage({ type: 'success', text: 'تم استلام طلبك بنجاح!' });
      setBalance(data.newBalance);
      setLink(''); 
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const availableServices = servicesData[selectedCategory] || [];
  const selectedService = availableServices.find(s => String(s.id) === String(selectedServiceId)) || availableServices[0];
  const totalCost = selectedService ? ((quantity / 1000) * selectedService.rate).toFixed(4) : '0.00';

  return (
    <>
      <Navbar />
      <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', paddingTop: '70px', background: 'var(--bg-secondary)' }}>
        {/* Sidebar */}
        <aside style={{ 
          width: '220px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
          padding: '1.2rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', 
          position: 'fixed', top: '70px', bottom: '0', overflowY: 'auto', zIndex: 10
        }}>
          <div style={{ 
            padding: '1.2rem 1rem', background: 'var(--gradient-primary)', borderRadius: '18px', 
            marginBottom: '1.5rem', textAlign: 'center', boxShadow: '0 8px 20px rgba(108,60,225,0.2)' 
          }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>رصيدك الحالي</p>
            <p style={{ color: 'white', fontSize: '1.8rem', fontWeight: 950, marginBottom: '0.8rem' }} dir="ltr">${balance !== null ? balance.toFixed(2) : '...'}</p>
            <Link href="/dashboard/deposit" style={{ 
              display: 'block', padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', 
              color: 'white', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s',
              backdropFilter: 'blur(5px)'
            }} className="hover-scale">
              + شحن رصيد
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {sideLinks.map((link, i) => (
              <Link key={i} href={link.href} style={{
                padding: '0.8rem 1rem', borderRadius: '12px', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: 700,
                background: link.active ? 'rgba(108,60,225,0.08)' : 'transparent',
                color: link.active ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: '1.2rem', opacity: link.active ? 1 : 0.7 }}>{link.icon}</span> {link.label}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid var(--border-color)' }}>
            <button 
              onClick={async () => {
                const res = await fetch('/api/auth/logout', { method: 'POST' });
                if (res.ok) window.location.href = '/';
              }}
              style={{ 
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '0.8rem 1rem', borderRadius: '12px', textDecoration: 'none', 
                display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', 
                fontWeight: 700, color: '#ff4d4d', cursor: 'pointer', transition: 'all 0.2s' 
              }} className="hover-danger">
              🚪 تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, marginRight: '220px', padding: '2rem 3rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>طلب جديد 🛒</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>أهلاً بك في لوحة تحكم <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>تفاعلكم</span></p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '0.6rem 1.2rem', borderRadius: '14px', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>حالة النظام: متصل</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }} className="dashboard-grid">
              {/* Order Form */}
                <div className="card" style={{ padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
                  {message.text && (
                    <div style={{ 
                      padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', fontSize: '0.9rem', 
                      fontWeight: 700, background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                      color: message.type === 'success' ? '#10b981' : '#ef4444', 
                      display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid transparent',
                      borderColor: message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>{message.type === 'success' ? '✅' : '❌'}</span> {message.text}
                    </div>
                  )}
                  
                  <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>القسم (Category)</label>
                        <select className="input-field" value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setSelectedServiceId(servicesData[e.target.value]?.[0]?.id || ''); }} style={{ cursor: 'pointer', height: '52px', borderRadius: '14px', fontWeight: 600 }} disabled={loading}>
                          {loading ? <option>جاري التحميل...</option> : categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                        <img src={getIcon(selectedCategory)} alt="Icon" width={32} height={32} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>الخدمة (Service)</label>
                      <select className="input-field" value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)} dir="ltr" style={{ cursor: 'pointer', fontSize: '0.9rem', height: '52px', borderRadius: '14px', fontWeight: 600 }} disabled={loading}>
                        {availableServices.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - ${s.rate.toFixed(4)} / 1k</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>الرابط (Link)</label>
                        <input type="text" className="input-field" placeholder="https://..." dir="ltr" value={link} onChange={e => setLink(e.target.value)} style={{ height: '52px', borderRadius: '14px', fontWeight: 600 }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>الكمية (Quantity)</label>
                        <input type="number" className="input-field" dir="ltr" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" style={{ height: '52px', borderRadius: '14px', fontWeight: 600 }} />
                      </div>
                    </div>

                    <div style={{ 
                      padding: '1.2rem 1.5rem', borderRadius: '18px', background: 'rgba(108,60,225,0.05)', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      border: '1.5px dashed rgba(108,60,225,0.2)'
                    }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>التكلفة الإجمالية:</span>
                      <span style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--brand-primary)' }} dir="ltr">${totalCost}</span>
                    </div>

                    <button disabled={submitting || Number(totalCost) === 0} type="submit" className="btn-primary" style={{ 
                      width: '100%', padding: '1.1rem', fontSize: '1.1rem', fontWeight: 900, 
                      borderRadius: '16px', boxShadow: '0 8px 25px rgba(108,60,225,0.3)',
                      transition: 'all 0.3s'
                    }}>
                      {submitting ? '⏳ جاري معالجة الطلب...' : '✅ تأكيد وتنفيذ الطلب'}
                    </button>
                  </form>
                </div>

              {/* Right Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Stats */}
                <div className="card" style={{ padding: '1.8rem', borderRadius: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📊</span> ملخص النشاط
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { label: 'إجمالي المصروفات', value: '$1,250.50', color: 'var(--text-primary)' },
                      { label: 'إجمالي الطلبات', value: '145', color: 'var(--text-primary)' },
                      { label: 'طلبات قيد المراجعة', value: '3', color: 'var(--brand-accent)' },
                      { label: 'حالة الحساب', value: 'مدقق ✓', color: 'var(--brand-success)' },
                    ].map((stat, i) => (
                      <div key={i} style={{ 
                        display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', 
                        background: 'var(--bg-secondary)', borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: stat.color }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Promo */}
                <div className="card" style={{ 
                  padding: '1.8rem', borderRadius: '24px', position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(108,60,225,0.05) 100%)'
                }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--brand-primary)', marginBottom: '0.7rem' }}>🚀 بوابة المطورين</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                      هل تمتلك موقع SMM خاص بك؟ اربط خدماتنا بلوحتك عبر الـ API واحصل على أسعار الجملة.
                    </p>
                    <Link href="/api-docs" className="btn-secondary" style={{ 
                      width: '100%', textAlign: 'center', padding: '0.8rem', fontSize: '0.9rem', 
                      borderRadius: '14px', fontWeight: 800, border: '2px solid var(--brand-primary)',
                      color: 'var(--brand-primary)' 
                    }}>
                      عرض وثائق الـ API 🔗
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hover-scale:hover { transform: translateY(-2px); background: rgba(255,255,255,0.3) !important; }
        .hover-danger:hover { background: rgba(255,77,77,0.1) !important; }
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 850px) {
          aside { display: none !important; }
          div[style*="marginRight: '220px'"] { margin-right: 0 !important; padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </>
  );
}
