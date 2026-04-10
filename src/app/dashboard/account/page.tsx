"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unlockedTier, setUnlockedTier] = useState<any>(null);

  // 🎵 Celebration Sounds
  const playCelebrate = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.play().catch(() => {});
  };
  const playClick = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play().catch(() => {});
  };

  const TIERS = [
    { id: 'new', name: 'جديد', spend: 0, discount: '0%', icon: '/tier_new.png', perks: [true, false, false, false, false, false] },
    { id: 'beginner', name: 'مبتدئ', spend: 25, discount: '0.5%', icon: '/tier_beginner.png', perks: [true, true, true, false, false, false] },
    { id: 'active', name: 'نشيط', spend: 100, discount: '2%', icon: '/tier_active.png', perks: [true, true, true, true, false, false] },
    { id: 'elite', name: 'مميز', spend: 500, discount: '5%', icon: '/tier_elite.png', perks: [true, true, true, true, true, true] },
    { id: 'vip', name: 'VIP', spend: 2500, discount: '8%', icon: '/tier_vip.png', perks: [true, true, true, true, true, true] },
    { id: 'royal', name: 'ملكي', spend: 5000, discount: '10%', icon: '/tier_royal.png', perks: [true, true, true, true, true, true] },
  ];

  const handleClaim = () => {
    playClick();
    setUnlockedTier(null);
    showToast(`تم تفعيل ميزات باقة ${unlockedTier.name} بنجاح! 🔥`, "success");
  };

  const simulateUnlock = (idx: number) => {
    setUnlockedTier(TIERS[idx]);
    playCelebrate();
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    currentPassword: ''
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          // 🎉 Send Reward Notification Instead of immediate popup
          const balance = data.user.balance || 0;
          const eligibleTier = [...TIERS].reverse().find(t => balance >= t.spend && t.spend > 0);
          if (eligibleTier) {
            const hasCelebrated = localStorage.getItem(`celebrated_tier_${eligibleTier.id}`);
            if (!hasCelebrated) {
              fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: data.user.id,
                  title: '🎁 هدية: مبروك وصولك لمستوى جديد!',
                  message: `مبروك! لقد أصبحت الآن في مستوى ${eligibleTier.name}. استلم هديتك الآن بضغط الزر بالأسفل. ✨`
                })
              });
              localStorage.setItem(`celebrated_tier_${eligibleTier.id}`, 'pending');
            }
          }
        }
      })
      .finally(() => setLoading(false));

    // Listen for Claim Event from Navbar
    const handleClaimEvent = () => {
      const balance = user?.balance || 0;
      const eligibleTier = [...TIERS].reverse().find(t => balance >= t.spend && t.spend > 0);
      if (eligibleTier) {
        setUnlockedTier(eligibleTier);
        playCelebrate();
        localStorage.setItem(`celebrated_tier_${eligibleTier.id}`, 'true');
      }
    };

    window.addEventListener('reward_claimed', handleClaimEvent);
    return () => window.removeEventListener('reward_claimed', handleClaimEvent);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        setFormData(prev => ({ ...prev, password: '', currentPassword: '' }));
      } else {
        showToast(data.error, "error");
      }
    } catch (err) {
      showToast("حدث خطأ في الاتصال", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh] opacity-50">
      <img src="https://img.icons8.com/fluency/256/loading-heart.png" className="animate-pulse w-16" alt="Loading" />
    </div>
  );

  return (
    <div className="max-w-[800px] mx-auto animate-fade-in-up relative">
      
      {/* 👾 Saudi Pixel-Art Motion Graphic */}
      {saving && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#07080a] animate-in fade-in duration-500">
           <div className="flex flex-col items-center gap-10 max-w-[400px] w-full text-center px-10">
              
              <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-[40px] border-4 border-white/10 bg-black/40 shadow-[0_0_50px_rgba(108,60,225,0.3)]">
                 {/* Retro speed lines */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-20"></div>
                 <div className="absolute inset-x-0 h-[4px] bg-white/5 left-1/4 animate-speed-line"></div>
                 <div className="absolute inset-x-0 h-[4px] bg-[var(--brand-primary)]/40 left-1/2 animate-speed-line animate-delay-300"></div>
                 <div className="absolute inset-x-0 h-[4px] bg-white/5 left-3/4 animate-speed-line animate-delay-600"></div>

                 <img 
                    src="/pixel_saudi.png" 
                    className="relative z-10 w-[300px] h-[300px] object-contain animate-pixel-run image-render-pixel" 
                    alt="Pixel Running..." 
                 />
                 
                 {/* Retro Scanline Effect */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full w-full pointer-events-none animate-scanline"></div>
              </div>

              <div className="space-y-4">
                 <h2 className="text-[2rem] font-black text-white tracking-widest uppercase font-retro">UPDATING... 👾</h2>
                 <p className="text-[var(--brand-primary)] text-[1.1rem] font-black tracking-tight">جاري تشغيل الطاقة البكسلية لحفظ بياناتك</p>
                 
                 <div className="flex justify-center gap-4 pt-4">
                    <div className="w-4 h-4 rounded-none bg-[var(--brand-primary)] animate-pulse"></div>
                    <div className="w-4 h-4 rounded-none bg-[var(--brand-primary)] animate-pulse animate-delay-200"></div>
                    <div className="w-4 h-4 rounded-none bg-[var(--brand-primary)] animate-pulse animate-delay-400"></div>
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* 🎊 Celebration Modal - UNLOCKED! */}
      {unlockedTier && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in zoom-in duration-500 overflow-hidden">
           <div className="relative max-w-lg w-full bg-[#0a0a0c] rounded-[3.5rem] p-10 border-4 border-yellow-400 shadow-[0_0_100px_rgba(250,204,21,0.2)] text-center">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
              <div className="mb-8 relative">
                 <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                 <img src={unlockedTier.icon} className="w-48 h-48 mx-auto drop-shadow-[0_0_40px_rgba(250,204,21,0.6)] animate-bounce" alt="Gold" />
              </div>
              <h2 className="text-[2.8rem] font-black text-white mb-2 leading-tight tracking-tighter">مبروووك! 🎉</h2>
              <p className="text-yellow-400 text-[1.4rem] font-black mb-8 px-4">لقد قمت بفتح باقة: {unlockedTier.name}</p>
              <div className="bg-white/5 rounded-[2.5rem] p-8 mb-10 text-right space-y-4 border border-white/5">
                 <p className="text-white/40 text-[0.8rem] font-black uppercase tracking-widest mb-2">المميزات الجديدة المكتسبة:</p>
                 <div className="flex items-center gap-4 text-[1.1rem] text-white font-black">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <span>خصم {unlockedTier.discount} دائم على الخدمات</span>
                 </div>
                 <div className="flex items-center gap-4 text-[1.1rem] text-white font-black">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <span>دعم فني أولوية ملكية 24/7</span>
                 </div>
                 <div className="flex items-center gap-4 text-[1.1rem] text-white font-black">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <span>دخول تلقائي في سحوبات الـ 100$</span>
                 </div>
              </div>
              <button onClick={() => setUnlockedTier(null)} className="btn-accent w-full py-5 rounded-[2rem] text-[1.2rem] font-black shadow-xl">تم الاستلام ✅</button>
           </div>
        </div>
      )}

      {/* Top Header & Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-lg">
              <img src="https://img.icons8.com/papercut/256/user-male-circle.png" width={34} height={34} alt="Avatar" />
           </div>
           <div>
             <h1 className="text-[1.8rem] font-black text-[var(--text-primary)] leading-tight">إعدادات حسابي</h1>
             <p className="text-[var(--text-secondary)] text-[0.8rem] font-medium">التحكم في بياناتك الشخصية</p>
           </div>
        </div>
        <div className="flex gap-3">
           <button 
              onClick={() => window.location.href = '/dashboard'}
              className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-3 text-[0.85rem] font-black hover:border-[var(--brand-primary)] transition-all"
           >
              <img src="https://img.icons8.com/fluency/256/back.png" width={18} height={18} alt="Back" />
              العودة للمتجر
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-8 shadow-lg border-[var(--border-color)] relative">
            <div className="flex flex-col gap-6">
              <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/checked-user-male.png" width={22} height={22} alt="user" />
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="username" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">اسم المستخدم</label>
                  <input 
                    id="username"
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="input-field h-14 rounded-2xl" 
                    placeholder="اسم المستخدم الجديد"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">البريد الإلكتروني (لا يمكن تغييره)</label>
                  <input 
                    id="email"
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    placeholder="بريدك الإلكتروني"
                    title="البريد الإلكتروني لا يمكن تغييره"
                    className="input-field h-14 rounded-2xl opacity-50 cursor-not-allowed bg-[var(--bg-secondary)]" 
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[var(--border-color)] w-full"></div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/lock.png" width={22} height={22} alt="security" />
                تغيير كلمة المرور
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="new-pass" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">كلمة المرور الجديدة</label>
                  <input 
                    id="new-pass"
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="input-field h-14 rounded-2xl" 
                    placeholder="اتركها فارغة إذا لا تريد التغيير"
                  />
                </div>
                {formData.password && (
                  <div>
                    <label htmlFor="curr-pass" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">كلمة المرور الحالية (للتأكيد)</label>
                    <input 
                      id="curr-pass"
                      type="password" 
                      value={formData.currentPassword}
                      onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="input-field h-14 rounded-2xl border-emerald-500/30 ring-emerald-500/10 focus:ring" 
                      placeholder="يجب إدخال كلمة المرور الحالية للحفظ"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary w-full py-5 rounded-2xl text-[1.1rem] font-black flex items-center justify-center gap-3 shadow-xl hover:shadow-[var(--brand-primary)]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <img src="https://img.icons8.com/fluency/256/save.png" width={24} height={24} className="brightness-0 invert" alt="save" /> 
              حفظ وتحديث البيانات
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          {/* Points & Balance Sidebar */}
          <div className="card p-6 bg-[var(--bg-secondary)] border-none">
            <h4 className="text-[0.9rem] font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <img src="https://img.icons8.com/fluency/256/diamond.png" width={18} height={18} alt="points" />
              رصيدك ونقاطك
            </h4>
            <div className="flex flex-col gap-4">
               {/* Balance Card */}
               <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)] group hover:border-[var(--brand-primary)]/50 transition-all">
                  <p className="text-[0.65rem] font-black text-[var(--text-secondary)] uppercase mb-1 flex justify-between">
                    الرصيد المتاح
                    <span className="text-[var(--brand-primary)] opacity-50">SAR</span>
                  </p>
                  <p className="text-[1.4rem] font-black text-[var(--brand-primary)]" dir="rtl">{user?.balance?.toFixed(2) || '0.00'} ر.س</p>
               </div>

               {/* Points Card - Sapphire Royal Style */}
               <div className="bg-gradient-to-br from-[#1a1c2e] to-[#0f111a] p-4 rounded-2xl border border-indigo-500/20 shadow-[0_4px_20px_rgba(79,70,229,0.1)] group hover:border-indigo-500/50 transition-all">
                  <p className="text-[0.65rem] font-black text-indigo-400 uppercase mb-1 flex justify-between">
                    نقاط تفاعلكم
                    <span className="animate-pulse">✨</span>
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-[1.4rem] font-black text-white" dir="rtl">{(user as any)?.points || '1,250'}</p>
                    <span className="text-[0.7rem] font-bold text-indigo-300/60 mb-1">نقطة</span>
                  </div>
                  <button className="mt-3 w-full py-2 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-[0.75rem] font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    استبدال النقاط
                  </button>
               </div>

               {/* Account Tier Card */}
               <div className="bg-yellow-400 p-4 rounded-2xl border-none shadow-lg shadow-yellow-400/10">
                  <p className="text-[0.65rem] font-black text-black/60 uppercase mb-1">حالة الحساب الحالية</p>
                  <p className="text-[1.2rem] font-black text-black flex items-center gap-2">
                    {user?.role === 'admin' ? 'إداري / ملكي' : 'مستوى جديد'}
                    <span className="text-[0.8rem]">👑</span>
                  </p>
               </div>

               <div className="px-1 pt-2">
                  <p className="text-[0.7rem] font-bold text-[var(--text-secondary)] mb-1">تاريخ انضمامك</p>
                  <p className="text-[0.9rem] font-bold text-[var(--text-primary)]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '---'}</p>
               </div>
            </div>
          </div>

          <div className="card p-6 border-r-4 border-[var(--brand-primary)]">
             <h4 className="text-[0.85rem] font-black text-[var(--text-primary)] mb-2 leading-relaxed">أمان عالـي 🛡️</h4>
             <p className="text-[0.75rem] text-[var(--text-secondary)] leading-relaxed font-medium">
               يتم تشفير جميع كلمات المرور وفصلها عن بياناتك الشخصية لضمان أقصى حماية.
             </p>
          </div>
        </div>
      </div>

      {/* 👑 VIP Membership System - Redesigned Section */}
      <div className="mt-16 mb-20 animate-in slide-in-from-bottom duration-1000">
         <div className="flex flex-col gap-2 mb-8 text-center md:text-right">
            <h2 className="text-[2.2rem] font-black text-white tracking-tight">نظام مستويات العضوية 🏆</h2>
            <p className="text-white/40 text-[1rem] font-medium">كلما زاد شحنك، زادت ميزاتك وخصوماتك التلقائية!</p>
         </div>

         {/* Grid 6 Tiers - Obsidian Style */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
               { id: 'new', name: 'جديد', spend: '0', discount: '0%', icon: '/tier_new.png', perks: [true, false, false, false, false, false] },
               { id: 'beginner', name: 'مبتدئ', spend: '25', discount: '0.5%', icon: '/tier_beginner.png', perks: [true, true, true, false, false, false] },
               { id: 'active', name: 'نشيط', spend: '100', discount: '2%', icon: '/tier_active.png', perks: [true, true, true, true, false, false] },
               { id: 'elite', name: 'مميز', spend: '500', discount: '5%', icon: '/tier_elite.png', perks: [true, true, true, true, true, true] },
               { id: 'vip', name: 'VIP', spend: '2,500', discount: '8%', icon: '/tier_vip.png', perks: [true, true, true, true, true, true] },
               { id: 'royal', name: 'ملكي', spend: '5,000', discount: '10%', icon: '/tier_royal.png', perks: [true, true, true, true, true, true] },
            ].map((tier, idx) => (
               <div key={idx} className={`relative overflow-hidden rounded-[2.5rem] p-6 flex flex-col gap-6 shadow-xl border-4 transition-all hover:scale-[1.03] ${tier.id === 'royal' ? 'bg-[#0a0a0c] border-yellow-400 shadow-yellow-400/20' : 'bg-[#0f1118] border-white/5 hover:border-white/10'}`}>
                  <div className={`p-4 rounded-[1.8rem] flex justify-between items-center ${tier.id === 'royal' ? 'bg-yellow-400' : 'bg-white/5'}`}>
                     <div className="flex flex-col">
                        <span className={`text-[0.65rem] font-black uppercase tracking-widest ${tier.id === 'royal' ? 'text-black/60' : 'text-white/40'}`}>انفق أكثر من</span>
                        <span className={`text-[1.3rem] font-black ${tier.id === 'royal' ? 'text-black' : 'text-white'}`}>{tier.spend} ر.س</span>
                     </div>
                     <img src={tier.icon} width={50} height={50} alt={tier.name} className="drop-shadow-lg" />
                  </div>

                  <div className="flex flex-col gap-3">
                     <h3 className="text-[1.8rem] font-black mb-2 text-white">{tier.name}</h3>
                     <div className="space-y-4">
                        {[
                           "دعم فني 24/7",
                           "نظام النقاط",
                           `خصم ${tier.discount} على الخدمات`,
                           "سحب على 100 دولار",
                           "متجر إلكتروني لمدة عام (قريباً)",
                           "دعم عبر الواتساب"
                        ].map((perk, pIdx) => (
                           <div key={pIdx} className="flex justify-between items-center gap-3">
                              <span className="text-[0.9rem] font-bold text-white/50">{perk}</span>
                              {tier.perks[pIdx] ? (
                                 <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_10px_#10b981]">
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                                 </div>
                              ) : (
                                 <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white/10 fill-current"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Comparison Header Table Logic */}
         <div className="hidden lg:block overflow-hidden rounded-[3rem] border-4 border-white/5 bg-[#0a0a0c] shadow-2xl">
            <div className="bg-white/5 p-8 flex justify-between items-center border-b border-white/5">
               <span className="text-white font-black text-[1.6rem]">جدول ميزات حالة الحساب</span>
               <div className="flex gap-12 ml-4 text-white/20">
                  <span className="font-black text-[0.8rem] w-16 text-center">جديد (0 ر.س)</span>
                  <span className="font-black text-[0.8rem] w-16 text-center text-yellow-500">مبتدئ (25 ر.س)</span>
                  <span className="font-black text-[0.8rem] w-16 text-center">نشيط (100 ر.س)</span>
                  <span className="font-black text-[0.8rem] w-16 text-center text-emerald-400">مميز (500 ر.س)</span>
                  <span className="font-black text-[0.8rem] w-16 text-center text-purple-400">VIP (2.5k ر.س)</span>
                  <span className="font-black text-[0.8rem] w-16 text-center text-yellow-400">ملكي (5k ر.س)</span>
               </div>
            </div>
            <div className="p-8 flex flex-col gap-4">
               {[
                  { name: 'دعم فني 24/7', checks: [true, true, true, true, true, true] },
                  { name: 'نظام النقاط', checks: [false, true, true, true, true, true] },
                  { name: 'خصم على الخدمات', checks: [false, true, true, true, true, true] },
                  { name: 'سحب على 100 دولار', checks: [false, false, true, true, true, true] },
                  { name: 'متجر إلكتروني (قريباً)', checks: [false, false, false, true, true, true] },
                  { name: 'دعم فني عبر الواتساب', checks: [false, false, false, false, true, true] },
               ].map((row, rIdx) => (
                  <div key={rIdx} className="bg-white/5 rounded-3xl p-5 flex justify-between items-center hover:bg-white/10 transition-all border border-white/5">
                     <span className="text-white font-black text-[1.1rem]">{row.name}</span>
                     <div className="flex gap-12 ml-4">
                        {row.checks.map((check, cIdx) => (
                           <div key={cIdx} className="w-16 flex justify-center">
                              {check ? (
                                 <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                                 </div>
                              ) : (
                                 <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/10 fill-current"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
