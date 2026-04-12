"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useCurrency } from '@/components/CurrencyProvider';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png' },
  { label: 'تقاريري', href: '/dashboard/analytics', icon: 'https://img.icons8.com/fluency/256/combo-chart.png', active: true },
];

export default function AnalyticsPage() {
  const { currency, formatPrice } = useCurrency();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/analytics')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <><Navbar />
        <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
          <div className="flex-1 flex items-center justify-center">
            <img src="https://img.icons8.com/fluency/256/loading.png" width={40} className="animate-spin" alt="loading" />
          </div>
        </div>
      </>
    );
  }

  const maxSpent = Math.max(...(data?.monthlyHistory?.map((m: any) => m.spent) || [1]));

  return (
    <><Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        <aside className="w-[250px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 fixed top-[70px] bottom-0 overflow-y-auto hidden md:flex flex-col gap-1">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-3 rounded-xl no-underline flex items-center gap-3 text-[0.9rem] font-bold transition-all ${l.active ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} width={22} height={22} alt={l.label} /> {l.label}
            </Link>
          ))}
        </aside>

        <div className="flex-1 md:mr-[250px] p-4 md:p-10">
          <div className="max-w-[900px] mx-auto space-y-8">

            <h1 className="text-[2rem] md:text-[2.5rem] font-black text-[var(--text-primary)] flex items-center gap-3">
              <img src="https://img.icons8.com/fluency/256/combo-chart.png" width={40} height={40} alt="analytics" />
              تقاريري وإحصائياتي
            </h1>

            {/* Savings Banner */}
            <div className="savings-banner">
              <div className="banner-overlay" />
              <div className="relative z-10">
                <p className="text-white/80 font-bold text-[0.9rem] mb-2">🎉 مبروك! أنت وفّرت مقارنة بالمواقع الأخرى</p>
                <div className="flex items-center justify-center gap-2" dir="ltr">
                  <span className="text-white font-black text-[3rem] md:text-[4rem]">{formatPrice(Number(data?.savings || 0))}</span>
                </div>
                <p className="text-white/70 font-bold text-[0.8rem] mt-2">منذ {new Date(data?.memberSince).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'إجمالي الإنفاق', value: formatPrice(data?.totalSpent || 0), icon: 'https://img.icons8.com/fluency/256/card-exchange.png', color: 'from-purple-500/10 border-purple-500/20' },
                { label: 'إجمالي الطلبات', value: data?.totalOrders || 0, icon: 'https://img.icons8.com/fluency/256/list.png', color: 'from-blue-500/10 border-blue-500/20' },
                { label: 'هذا الشهر', value: formatPrice(data?.thisMonthSpent || 0), icon: 'https://img.icons8.com/fluency/256/calendar.png', color: 'from-amber-500/10 border-amber-500/20' },
                { label: 'طلبات الشهر', value: data?.thisMonthOrders || 0, icon: 'https://img.icons8.com/fluency/256/shopping-cart.png', color: 'from-emerald-500/10 border-emerald-500/20' },
              ].map((s, i) => (
                <div key={i} className={`card p-5 rounded-[20px] bg-gradient-to-br ${s.color} border text-center`}>
                  <img src={s.icon} width={28} height={28} alt={s.label} className="mx-auto mb-2" />
                  <p className="text-[1.1rem] md:text-[1.3rem] font-black text-[var(--text-primary)]">{s.value}</p>
                  <p className="text-[0.7rem] font-bold text-[var(--text-secondary)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Monthly Chart */}
            <div className="card p-6 md:p-8 rounded-[24px]">
              <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/256/bar-chart.png" width={24} height={24} alt="chart" />
                الإنفاق الشهري (آخر 6 أشهر)
              </h3>
              <div className="flex items-end gap-3 h-[200px]">
                {data?.monthlyHistory?.map((m: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-[0.6rem] font-black text-[var(--text-primary)]" dir="ltr">{formatPrice(m.spent)}</p>
                    <div 
                      className="chart-bar transition-all hover:brightness-110" 
                      style={{ '--bar-height': `${Math.max((m.spent / maxSpent) * 160, 8)}px` } as any} 
                    />
                    <p className="text-[0.65rem] font-bold text-[var(--text-tertiary)]">{m.month}</p>
                    <p className="text-[0.55rem] text-[var(--text-tertiary)]">{m.orders} طلب</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Services */}
            <div className="card p-6 rounded-[24px]">
              <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/256/star.png" width={24} height={24} alt="top" />
                أكثر الخدمات طلباً
              </h3>
              {data?.topServices?.length > 0 ? (
                <div className="space-y-3">
                  {data.topServices.map((s: any, i: number) => {
                    const maxCount = data.topServices[0].count;
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <span className="w-7 h-7 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-black text-[0.75rem] flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-[0.8rem] text-[var(--text-primary)] truncate max-w-[200px]">{s.name}</p>
                            <p className="text-[0.7rem] font-black text-[var(--text-secondary)]">{s.count} طلب • {formatPrice(s.total)}</p>
                          </div>
                          <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-l from-[var(--brand-primary)] to-purple-400 rounded-full transition-all" 
                              style={{ '--progress-width': `${(s.count / maxCount) * 100}%` } as any} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--text-tertiary)] font-bold">لا توجد طلبات بعد</p>
                </div>
              )}
            </div>

          </div>
        </div>
        <style jsx>{`
          .savings-banner {
            background: linear-gradient(to left, #10b981, #0d9488);
            border-radius: 24px;
            padding: 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .banner-overlay {
            position: absolute;
            inset: 0;
            opacity: 0.1;
            background-image: url(https://img.icons8.com/fluency/256/money-bag.png);
            background-size: 60px;
            background-repeat: repeat;
          }
          .chart-bar {
            width: 100%;
            height: var(--bar-height);
            border-radius: 12px 12px 0 0;
            background: linear-gradient(to top, var(--brand-primary), rgba(108, 60, 225, 0.6));
          }
          .progress-fill {
            height: 100%;
            width: var(--progress-width);
          }
        `}</style>
      </div>
    </>
  );
}
