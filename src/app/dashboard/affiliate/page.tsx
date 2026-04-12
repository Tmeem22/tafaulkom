"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';
import { useCurrency } from '@/components/CurrencyProvider';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png', active: true },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png' },
];

export default function AffiliatePage() {
  const { formatPrice } = useCurrency();
  const [data, setData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'monthly' | 'alltime'>('monthly');

  // Convert USD commission to SAR for formatPrice
  const toSar = (usd: number) => usd * 3.75;

  useEffect(() => {
    Promise.all([
      fetch('/api/user/affiliate').then(r => r.json()),
      fetch('/api/user/affiliate/leaderboard').then(r => r.json())
    ]).then(([affData, lbData]) => {
      setData(affData);
      setLeaderboard(lbData);
    }).catch(() => showToast('فشل تحميل البيانات', 'error'))
    .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      showToast('تم نسخ الرابط! 📋', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await fetch('/api/user/affiliate', { method: 'POST' });
      const result = await res.json();
      if (res.ok) {
        showToast(`تم تحويل الأرباح لرصيدك بنجاح! 🎉`, 'success');
        const refreshRes = await fetch('/api/user/affiliate');
        setData(await refreshRes.json());
      } else {
        showToast(result.error, 'error');
      }
    } catch (e) {
      showToast('حدث خطأ', 'error');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
       <img src="https://img.icons8.com/fluency/256/loading.png" width={50} className="animate-spin" alt="loading" />
    </div>
  );

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        <aside className="w-[250px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 fixed top-[70px] bottom-0 overflow-y-auto hidden md:flex flex-col gap-1">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-3 rounded-xl no-underline flex items-center gap-3 text-[0.9rem] font-bold transition-all ${l.active ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} width={22} height={22} alt={l.label} /> {l.label}
            </Link>
          ))}
        </aside>

        <div className="flex-1 md:mr-[250px] p-4 md:p-10 animate-fade-in">
          <div className="max-w-[1000px] mx-auto space-y-8">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-l from-[var(--brand-primary)] to-[#8B5CF6] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-right">
                     <span className="bg-white/20 px-4 py-1.5 rounded-full text-[0.8rem] font-black uppercase tracking-widest mb-4 inline-block backdrop-blur-md">برنامج الشركاء</span>
                     <h1 className="text-[2.5rem] md:text-[3.5rem] font-black leading-tight mb-4">اكسب أكثر<br/>بجهد أقل!</h1>
                     <p className="text-white/80 text-[1.1rem] font-bold max-w-md">شارك رابط الإحالة الخاص بك واحصل على عمولة 1.5% من كل طلب يقوم به أصدقاؤك مدى الحياة.</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[28px] text-center min-w-[300px] shadow-2xl shadow-black/20 animate-float">
                     <p className="text-white/70 text-[0.9rem] font-bold mb-1">أرباحك القابلة للسحب</p>
                     <p className="text-[3.5rem] font-black leading-none mb-6">{formatPrice(toSar(data?.currentBalance || 0))}</p>
                     <button 
                       onClick={handleWithdraw}
                       disabled={withdrawing || (data?.currentBalance || 0) < 1}
                       className="w-full bg-white text-[var(--brand-primary)] py-4 rounded-2xl font-black text-[1.1rem] hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                     >
                       {withdrawing ? 'جاري التحويل...' : 'سحب للأرصاد 💸'}
                     </button>
                  </div>
               </div>
            </div>

            {/* Referral Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
               <div className="card-glass p-8 rounded-[32px] shadow-xl border-white/10">
                  <h3 className="text-[1.5rem] font-black mb-6 flex items-center gap-3">
                     <img src="https://img.icons8.com/fluency/256/link.png" width={32} height={32} alt="link" />
                     رابط الإحالة الذكي
                  </h3>
                  
                  <div className="relative group mb-8">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex flex-col sm:flex-row gap-4 bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-color)]">
                       <span className="flex-1 font-mono text-[0.9rem] text-[var(--text-primary)] break-all flex items-center" dir="ltr">{data?.referralLink}</span>
                       <button onClick={copyLink} className="bg-[var(--brand-primary)] text-white px-8 py-3 rounded-xl font-black transition-all hover:brightness-110 active:scale-95">
                         {copied ? 'تم النسخ ✅' : 'نسخ الرابط'}
                       </button>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                     <p className="w-full text-[0.9rem] font-bold text-[var(--text-secondary)] mb-2">شارك عبر المنصات:</p>
                     {[
                       { name: 'واتساب', icon: 'https://img.icons8.com/color/96/whatsapp.png', color: 'hover:bg-green-500/10' },
                       { name: 'تيليجرام', icon: 'https://img.icons8.com/color/96/telegram-app.png', color: 'hover:bg-blue-500/10' },
                       { name: 'X تويتر', icon: 'https://img.icons8.com/color/96/twitter.png', color: 'hover:bg-black/10' },
                       { name: 'انستقرام', icon: 'https://img.icons8.com/color/96/instagram-new.png', color: 'hover:bg-pink-500/10' }
                     ].map((s, i) => (
                       <button key={i} className={`flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--border-color)] text-[0.85rem] font-bold transition-all ${s.color}`}>
                         <img src={s.icon} width={20} height={20} alt={s.name} /> {s.name}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="card p-8 rounded-[32px] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]">
                  <h3 className="font-black text-[1.2rem] mb-6">رحلة الأرباح 📈</h3>
                  {/* Simple SVG Chart */}
                  <div className="h-48 w-full relative mb-6">
                     <svg className="w-full h-full" viewBox="0 0 100 50">
                        <path d="M 0 45 Q 25 40, 50 25 T 100 5" fill="none" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" className="animate-progress-fast" style={{ strokeDasharray: '200', strokeDashoffset: '0' }}/>
                        <circle cx="100" cy="5" r="4" fill="var(--brand-primary)" className="animate-pulse" />
                     </svg>
                     <div className="absolute inset-0 flex items-end justify-between px-2 opacity-50 text-[0.6rem] font-bold text-[var(--text-tertiary)]">
                        <span>البداية</span>
                        <span>نمو</span>
                        <span>أرباح</span>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-[var(--border-color)]">
                        <span className="text-[0.8rem] font-bold text-[var(--text-secondary)]">إجمالي المكتسب</span>
                        <span className="font-black text-emerald-500" dir="ltr">{formatPrice(toSar(data?.totalCommission || 0))}</span>
                     </div>
                     <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-[var(--border-color)]">
                        <span className="text-[0.8rem] font-bold text-[var(--text-secondary)]">عدد الإحالات</span>
                        <span className="font-black text-[var(--brand-primary)]">{data?.totalReferrals || 0}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Leaderboard Section */}
            <div className="card p-8 rounded-[32px] border-amber-500/30 bg-gradient-to-tr from-amber-500/[0.03] to-transparent">
               <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                  <div>
                    <h2 className="text-[1.8rem] font-black text-[var(--text-primary)] flex items-center gap-3">
                       <img src="https://img.icons8.com/fluency/256/trophy.png" width={42} height={42} alt="trophy" />
                       مسابقة المسوقين لهذا الشهر
                    </h2>
                    <p className="text-[var(--text-secondary)] font-bold mt-2">جوائز نقدية كبرى لأفضل 5 مسوقين في {leaderboard?.currentMonth}</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-2xl">
                     <span className="text-amber-600 font-black text-[0.9rem] flex items-center gap-2">
                       <img src="https://img.icons8.com/fluency/256/hourglass.png" width={18} height={18} alt="time" />
                       متبقي: {leaderboard?.daysRemaining} يوم
                     </span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
                  {leaderboard?.prizes?.map((p: any) => (
                    <div key={p.rank} className={`p-6 rounded-3xl text-center relative overflow-hidden transition-all hover:scale-105 bg-gradient-to-b ${p.color} border-white/10 shadow-lg`}>
                       <p className="text-[2.2rem] mb-2">{p.emoji}</p>
                       <p className="text-white/90 text-[0.7rem] font-black uppercase mb-1">{p.title}</p>
                       <p className="text-white text-[1.3rem] font-black">{p.prize}</p>
                    </div>
                  ))}
               </div>

               <div className="space-y-3">
                  {(activeTab === 'monthly' ? leaderboard?.monthly : leaderboard?.allTime)?.map((entry: any, i: number) => (
                     <div key={i} className={`flex items-center justify-between p-5 rounded-[22px] transition-all ${entry.isCurrentUser ? 'bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30' : 'bg-[var(--bg-secondary)] border border-transparent'}`}>
                        <div className="flex items-center gap-5">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-[1.2rem] ${i < 3 ? 'bg-amber-500 text-white shadow-xl rotate-[-10deg]' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}>
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : entry.rank}
                           </div>
                           <div>
                              <p className="font-black text-[1rem] flex items-center gap-2">
                                {entry.username} {entry.isCurrentUser && <span className="text-[0.65rem] bg-[var(--brand-primary)] text-white px-2 py-0.5 rounded-full">أنت</span>}
                              </p>
                              <p className="text-[0.7rem] text-[var(--text-tertiary)] font-bold">{entry.totalReferrals} إحالة • {entry.monthlyOrders || entry.totalOrders} طلبات</p>
                           </div>
                        </div>
                        <div className="text-left font-black text-[1.2rem] text-emerald-500" dir="ltr">
                           {formatPrice(toSar(activeTab === 'monthly' ? entry.monthlyCommission : entry.totalCommission))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Recent History */}
            <div className="card p-8 rounded-[32px]">
               <h3 className="font-black text-[1.3rem] mb-6 flex items-center gap-3">
                  <img src="https://img.icons8.com/fluency/256/transaction-list.png" width={28} height={28} alt="history" />
                  آخر العمولات المكتسبة
               </h3>
               <div className="space-y-4">
                  {data?.recentCommissions?.length > 0 ? data.recentCommissions.map((c: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-[var(--bg-secondary)] rounded-2xl hover:translate-x-[-5px] transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[1.2rem]">💰</div>
                          <div>
                             <p className="font-black text-[0.9rem]">عمولة من صديق #{c.from}</p>
                             <p className="text-[0.7rem] text-[var(--text-tertiary)]">{new Date(c.date).toLocaleDateString('ar-SA')}</p>
                          </div>
                       </div>
                       <div className="text-left">
                          <p className="font-black text-emerald-500" dir="ltr">+{formatPrice(toSar(c.amount))}</p>
                          <p className="text-[0.65rem] text-[var(--text-tertiary)] font-bold">من عملية {formatPrice(toSar(c.orderAmount))}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-50 font-bold">لم تحقق أي عمولات بعد، ابدأ اليوم!</div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
