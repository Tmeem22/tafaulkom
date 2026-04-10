"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png', active: true },
];

export default function AffiliatePage() {
  const [data, setData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'monthly' | 'alltime'>('monthly');

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
        showToast(`تم تحويل ${result.transferred.toFixed(4)}$ لرصيدك! 🎉`, 'success');
        // Refresh data
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <img src="https://img.icons8.com/fluency/256/loading.png" width={40} className="animate-spin mx-auto mb-4" alt="loading" />
              <p className="text-[var(--text-secondary)] font-bold">جاري تحميل بيانات التسويق...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        {/* Sidebar */}
        <aside className="w-[250px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 fixed top-[70px] bottom-0 overflow-y-auto hidden md:flex flex-col gap-1">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-3 rounded-xl no-underline flex items-center gap-3 text-[0.9rem] font-bold transition-all ${l.active ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} width={22} height={22} alt={l.label} />
              {l.label}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:mr-[250px] p-4 md:p-10">
          <div className="max-w-[900px] mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-[2rem] md:text-[2.5rem] font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                  <img src="https://img.icons8.com/fluency/256/share.png" width={40} height={40} alt="affiliate" />
                  التسويق بالعمولة
                </h1>
                <p className="text-[var(--text-secondary)] font-bold mt-1">شارك رابطك واكسب 1.5% من كل عملية شراء</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'إجمالي الإحالات', value: data?.totalReferrals || 0, icon: 'https://img.icons8.com/fluency/256/user-group-man-man.png', color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20' },
                { label: 'إجمالي العمولات', value: `$${(data?.totalCommission || 0).toFixed(2)}`, icon: 'https://img.icons8.com/fluency/256/money-bag.png', color: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' },
                { label: 'رصيد العمولات', value: `$${(data?.currentBalance || 0).toFixed(2)}`, icon: 'https://img.icons8.com/fluency/256/wallet.png', color: 'from-amber-500/10 to-amber-600/5 border-amber-500/20' },
                { label: 'نسبة العمولة', value: '1.5%', icon: 'https://img.icons8.com/fluency/256/percentage.png', color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20' },
              ].map((stat, i) => (
                <div key={i} className={`card p-5 rounded-[20px] bg-gradient-to-br ${stat.color} border text-center`}>
                  <img src={stat.icon} width={32} height={32} alt={stat.label} className="mx-auto mb-3" />
                  <p className="text-[1.4rem] md:text-[1.6rem] font-black text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-[0.7rem] font-bold text-[var(--text-secondary)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Referral Link */}
            <div className="card p-6 md:p-8 rounded-[24px] border-2 border-dashed border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent">
              <h2 className="text-[1.3rem] font-black text-[var(--text-primary)] mb-1 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/256/link.png" width={24} height={24} alt="link" />
                رابط الإحالة الخاص بك
              </h2>
              <p className="text-[0.8rem] text-[var(--text-secondary)] font-bold mb-5">شارك هذا الرابط مع أصدقائك واحصل على 1.5% من كل مشترياتهم مدى الحياة!</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] font-mono text-[0.8rem] text-[var(--text-primary)] break-all select-all" dir="ltr">
                  {data?.referralLink || 'جاري التحميل...'}
                </div>
                <button 
                  onClick={copyLink}
                  className={`px-8 py-4 rounded-2xl font-black text-[0.9rem] transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    copied 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-[var(--brand-primary)] text-white hover:brightness-110 shadow-lg shadow-purple-500/20'
                  }`}
                >
                  {copied ? (
                    <><img src="https://img.icons8.com/fluency/256/checkmark.png" width={20} height={20} className="brightness-0 invert" alt="ok" /> تم النسخ!</>
                  ) : (
                    <><img src="https://img.icons8.com/fluency/256/copy.png" width={20} height={20} className="brightness-0 invert" alt="copy" /> نسخ الرابط</>
                  )}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`https://wa.me/?text=${encodeURIComponent('سجّل في تفاعلكم واحصل على أفضل خدمات SMM! 🚀\n' + (data?.referralLink || ''))}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 px-4 rounded-full bg-[#25d366]/10 text-[#25d366] text-[0.8rem] font-black no-underline hover:bg-[#25d366] hover:text-white transition-all border border-[#25d366]/20">
                  <img src="https://img.icons8.com/color/96/whatsapp.png" width={20} height={20} alt="whatsapp" /> واتساب
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(data?.referralLink || '')}&text=${encodeURIComponent('سجّل في تفاعلكم واحصل على أفضل خدمات SMM! 🚀')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 px-4 rounded-full bg-[#0088cc]/10 text-[#0088cc] text-[0.8rem] font-black no-underline hover:bg-[#0088cc] hover:text-white transition-all border border-[#0088cc]/20">
                  <img src="https://img.icons8.com/color/96/telegram-app.png" width={20} height={20} alt="telegram" /> تيليجرام
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('سجّل في تفاعلكم واحصل على أفضل خدمات SMM! 🚀 ' + (data?.referralLink || ''))}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 px-4 rounded-full bg-[#1da1f2]/10 text-[#1da1f2] text-[0.8rem] font-black no-underline hover:bg-[#1da1f2] hover:text-white transition-all border border-[#1da1f2]/20">
                  <img src="https://img.icons8.com/color/96/twitter.png" width={20} height={20} alt="twitter" /> تويتر
                </a>
              </div>
            </div>

            {/* 🏆 LEADERBOARD SECTION */}
            <div className="card p-0 rounded-[28px] overflow-hidden border-2 border-amber-500/20">
              {/* Header Banner */}
              <div className="bg-gradient-to-l from-amber-500 via-yellow-500 to-amber-600 p-6 md:p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url(https://img.icons8.com/fluency/256/trophy.png)', backgroundSize: '80px', backgroundRepeat: 'repeat'}} />
                <div className="relative z-10">
                  <h2 className="text-[1.8rem] md:text-[2.2rem] font-black text-white mb-2 tracking-tight">🏆 مسابقة أفضل مسوّق</h2>
                  <p className="text-white/90 font-bold text-[0.95rem] mb-4">شهر {leaderboard?.currentMonth} {leaderboard?.currentYear} | جوائز نقدية حقيقية لأفضل 5!</p>
                  <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-5 py-2.5 rounded-full">
                    <img src="https://img.icons8.com/fluency/256/hourglass.png" width={18} height={18} className="brightness-0 invert" alt="timer" />
                    <span className="text-white font-black text-[0.9rem]">{leaderboard?.daysRemaining || 0} يوم متبقي</span>
                  </div>
                </div>
              </div>

              {/* Prize Tiers */}
              <div className="p-5 md:p-8 bg-[var(--bg-card)]">
                <div className="grid grid-cols-5 gap-2 md:gap-4 mb-8">
                  {(leaderboard?.prizes || []).map((p: any) => (
                    <div key={p.rank} className={`text-center p-3 md:p-4 rounded-2xl bg-gradient-to-b ${p.color} relative ${p.rank <= 3 ? 'scale-100' : 'scale-95 opacity-80'}`}>
                      <p className="text-[1.5rem] md:text-[2rem] mb-1">{p.emoji}</p>
                      <p className="text-white font-black text-[0.7rem] md:text-[0.85rem]">{p.title}</p>
                      <p className="text-white font-black text-[1rem] md:text-[1.4rem] mt-1">{p.prize}</p>
                      {p.rank === 1 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />}
                    </div>
                  ))}
                </div>

                {/* User's current position */}
                <div className="bg-gradient-to-l from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-black text-[1.2rem] shadow-lg">
                      {leaderboard?.userRank || '—'}
                    </div>
                    <div>
                      <p className="font-black text-[1rem] text-[var(--text-primary)]">مركزك الحالي هذا الشهر</p>
                      <p className="text-[0.75rem] text-[var(--text-secondary)] font-bold">
                        {leaderboard?.userMonthlyOrders || 0} طلب عمولة • ${(leaderboard?.userMonthlyCommission || 0).toFixed(2)} مكسب
                      </p>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[0.7rem] text-[var(--text-tertiary)] font-bold">شارك أكثر = ارتقِ في الترتيب!</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-[var(--bg-secondary)] p-1.5 rounded-2xl">
                  <button onClick={() => setActiveTab('monthly')} className={`flex-1 py-3 rounded-xl font-black text-[0.85rem] transition-all ${activeTab === 'monthly' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-md' : 'text-[var(--text-secondary)]'}`}>
                    📅 هذا الشهر
                  </button>
                  <button onClick={() => setActiveTab('alltime')} className={`flex-1 py-3 rounded-xl font-black text-[0.85rem] transition-all ${activeTab === 'alltime' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-md' : 'text-[var(--text-secondary)]'}`}>
                    👑 على الإطلاق
                  </button>
                </div>

                {/* Leaderboard Table */}
                <div className="space-y-2">
                  {(activeTab === 'monthly' ? leaderboard?.monthly : leaderboard?.allTime)?.length > 0 ? (
                    (activeTab === 'monthly' ? leaderboard.monthly : leaderboard.allTime).map((entry: any, i: number) => {
                      const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                      const rankColors = ['bg-amber-500/10 border-amber-500/30', 'bg-slate-200/10 border-slate-400/30', 'bg-amber-700/10 border-amber-700/30', 'bg-blue-500/5 border-blue-500/15', 'bg-purple-500/5 border-purple-500/15'];
                      return (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${entry.isCurrentUser ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30 ring-2 ring-[var(--brand-primary)]/20' : (i < 5 ? rankColors[i] : 'bg-[var(--bg-secondary)] border-transparent')}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[1.1rem] ${i < 3 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-md' : 'bg-[var(--bg-card)] text-[var(--text-primary)]'}`}>
                              {i < 5 ? rankEmojis[i] : entry.rank}
                            </div>
                            <div>
                              <p className={`font-black text-[0.9rem] ${entry.isCurrentUser ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}>
                                {entry.username} {entry.isCurrentUser && '(أنت)'}
                              </p>
                              <p className="text-[0.7rem] text-[var(--text-tertiary)] font-bold">
                                {entry.totalReferrals || 0} إحالة • {activeTab === 'monthly' ? entry.monthlyOrders : entry.totalOrders} طلب عمولة
                              </p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-black text-emerald-500 text-[1rem]" dir="ltr">
                              ${(activeTab === 'monthly' ? entry.monthlyCommission : entry.totalCommission)?.toFixed(2)}
                            </p>
                            {i < 5 && activeTab === 'monthly' && (
                              <p className="text-[0.6rem] text-amber-500 font-black">🏆 {leaderboard?.prizes?.[i]?.prize}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <img src="https://img.icons8.com/fluency/256/leaderboard.png" width={60} height={60} className="mx-auto mb-4 opacity-30" alt="empty" />
                      <p className="text-[var(--text-tertiary)] font-black text-[1.1rem]">لا يوجد متسابقون بعد!</p>
                      <p className="text-[var(--text-tertiary)] text-[0.85rem] mt-2 max-w-md mx-auto">كن أول من يشارك رابط الإحالة ويتصدر القائمة هذا الشهر واحصل على المركز الأول والجائزة الكبرى $25!</p>
                    </div>
                  )}
                </div>

                {/* Motivational Banner */}
                <div className="mt-8 bg-gradient-to-l from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                  <h4 className="font-black text-[1.1rem] text-[var(--text-primary)] mb-2">💡 نصائح لتصبح البطل!</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-right">
                    <div className="flex items-start gap-3">
                      <span className="text-[1.2rem]">📱</span>
                      <div>
                        <p className="font-black text-[0.8rem] text-[var(--text-primary)]">شارك بالقروبات</p>
                        <p className="text-[0.7rem] text-[var(--text-secondary)]">أرسل رابطك في قروبات الواتساب والتيليجرام</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[1.2rem]">🎥</span>
                      <div>
                        <p className="font-black text-[0.8rem] text-[var(--text-primary)]">محتوى فيديو</p>
                        <p className="text-[0.7rem] text-[var(--text-secondary)]">اصنع فيديو قصير يشرح مميزات المنصة</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[1.2rem]">💬</span>
                      <div>
                        <p className="font-black text-[0.8rem] text-[var(--text-primary)]">توصية مباشرة</p>
                        <p className="text-[0.7rem] text-[var(--text-secondary)]">أنصح بالمنصة للمؤثرين الذين تعرفهم</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Withdraw Card */}
              <div className="card p-6 rounded-[24px]">
                <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <img src="https://img.icons8.com/fluency/256/withdraw.png" width={24} height={24} alt="withdraw" />
                  سحب الأرباح
                </h3>
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl text-center mb-4">
                  <p className="text-[0.75rem] font-bold text-[var(--text-secondary)] mb-1">رصيد العمولات المتاح</p>
                  <p className="text-[2.5rem] font-black text-emerald-500" dir="ltr">${(data?.currentBalance || 0).toFixed(4)}</p>
                </div>
                <button 
                  onClick={handleWithdraw}
                  disabled={withdrawing || (data?.currentBalance || 0) < 1}
                  className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {withdrawing ? 'جاري التحويل...' : 'تحويل إلى الرصيد الأساسي'}
                </button>
                <p className="text-[0.7rem] text-[var(--text-tertiary)] font-bold mt-3 text-center">الحد الأدنى للسحب: 1.00$</p>
              </div>

              {/* How it Works */}
              <div className="card p-6 rounded-[24px]">
                <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <img src="https://img.icons8.com/fluency/256/info.png" width={24} height={24} alt="info" />
                  كيف يعمل؟
                </h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'شارك رابطك', desc: 'أرسل رابط الإحالة لأصدقائك عبر أي منصة' },
                    { step: '2', title: 'يسجّل صديقك', desc: 'عند التسجيل عبر رابطك، يرتبط حسابه بك تلقائياً' },
                    { step: '3', title: 'يشتري خدمات', desc: 'في كل مرة يشتري صديقك خدمة، تحصل على 1.5% عمولة' },
                    { step: '4', title: 'اسحب أرباحك', desc: 'حوّل أرباحك لرصيدك الأساسي واستخدمها كما تشاء' },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-black text-[0.8rem] flex-shrink-0">{s.step}</div>
                      <div>
                        <p className="font-black text-[0.9rem] text-[var(--text-primary)]">{s.title}</p>
                        <p className="text-[0.75rem] text-[var(--text-secondary)] font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Commissions */}
            <div className="card p-6 rounded-[24px]">
              <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/256/transaction-list.png" width={24} height={24} alt="history" />
                سجل العمولات
              </h3>
              {data?.recentCommissions?.length > 0 ? (
                <div className="space-y-3">
                  {data.recentCommissions.map((c: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-card)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <img src="https://img.icons8.com/fluency/256/money-bag.png" width={22} height={22} alt="commission" />
                        </div>
                        <div>
                          <p className="font-black text-[0.85rem] text-[var(--text-primary)]">عمولة من {c.from}</p>
                          <p className="text-[0.7rem] text-[var(--text-tertiary)]">{new Date(c.date).toLocaleDateString('ar-EG')}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-emerald-500 text-[0.9rem]" dir="ltr">+${c.amount.toFixed(4)}</p>
                        <p className="text-[0.65rem] text-[var(--text-tertiary)]" dir="ltr">من طلب ${c.orderAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <img src="https://img.icons8.com/fluency/256/empty-box.png" width={60} height={60} className="mx-auto mb-4 opacity-40" alt="empty" />
                  <p className="text-[var(--text-tertiary)] font-bold">لا توجد عمولات بعد</p>
                  <p className="text-[0.8rem] text-[var(--text-tertiary)] mt-1">شارك رابطك الآن وابدأ بكسب العمولات!</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
