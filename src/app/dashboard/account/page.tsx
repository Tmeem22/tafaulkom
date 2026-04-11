"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

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
  { label: 'إعدادات الحساب', href: '/dashboard/account', icon: 'https://img.icons8.com/papercut/256/user-male-circle.png', active: true },
];

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unlockedTier, setUnlockedTier] = useState<any>(null);

  const playCelebrate = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
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
                  message: `مبروك! لقد أصبحت الآن في مستوى ${eligibleTier.name}. ✨`
                })
              }).then(res => {
                if (res.ok) localStorage.setItem(`celebrated_tier_${eligibleTier.id}`, 'pending');
              });
            }
          }
        }
      })
      .finally(() => setLoading(false));

    const handleClaimCheck = () => {
      const pendingClaim = localStorage.getItem('pending_reward_claim');
      if (pendingClaim) {
        localStorage.removeItem('pending_reward_claim');
        window.location.reload();
      }
    };
    window.addEventListener('reward_claimed', handleClaimCheck);
    window.addEventListener('storage', handleClaimCheck);
    return () => {
      window.removeEventListener('reward_claimed', handleClaimCheck);
      window.removeEventListener('storage', handleClaimCheck);
    };
  }, []);

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
        setFormData({ username: '', password: '', currentPassword: '' });
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
    <><Navbar />
      <div className="flex justify-center items-center h-[80vh] opacity-50" dir="rtl">
        <img src="https://img.icons8.com/fluency/256/loading-heart.png" className="animate-pulse w-16" alt="Loading" />
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        {/* Sidebar */}
        <aside className="w-[260px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 px-4 flex flex-col gap-1 fixed top-[70px] bottom-0 overflow-y-auto hidden lg:flex">
          <div className="p-6 bg-[var(--gradient-primary)] rounded-[30px] mb-6 text-center shadow-lg">
            <p className="text-white/80 text-[0.7rem] font-black uppercase mb-2">رصيدك الحالي</p>
            <p className="text-white text-[1.8rem] font-black mb-3" dir="ltr">{user?.balance?.toFixed(2) || '0.00'} ر.س</p>
            <Link href="/dashboard/deposit" className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/20 text-white text-[0.8rem] font-black no-underline hover:bg-white/30 transition-all">
               شحن رصيدك ⚡
            </Link>
          </div>
          <div className="flex flex-col gap-1.5">
            {sideLinks.map((l, i) => (
              <Link key={i} href={l.href} className={`p-4 rounded-2xl no-underline flex items-center gap-4 text-[0.85rem] font-black transition-all ${l.active ? 'bg-[var(--brand-primary)] text-white shadow-md shadow-purple-500/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
                <img src={l.icon} width={22} height={22} alt={l.label} className={l.active ? 'brightness-0 invert' : ''} />
                {l.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:mr-[260px] p-6 lg:p-12">
          <div className="max-w-[1000px] mx-auto animate-fade-in-up">
            
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[22px] bg-[var(--brand-primary)]/10 flex items-center justify-center shadow-inner">
                     <img src="https://img.icons8.com/papercut/256/user-male-circle.png" width={40} height={40} alt="User" />
                  </div>
                  <div>
                     <h1 className="text-[2rem] font-black text-[var(--text-primary)] leading-tight">إعدادات الحساب</h1>
                     <p className="text-[var(--text-secondary)] font-bold">إدارة بياناتك، كلمة المرور، ونظام العضوية الملكي 👑</p>
                  </div>
               </div>
               <Link href="/dashboard" className="btn-secondary px-6 py-4 rounded-2xl flex items-center gap-3 text-[0.85rem] font-black">
                  <img src="https://img.icons8.com/fluency/256/shopping-cart.png" width={18} height={18} alt="Store" />
                  العودة للطلب
               </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr,320px] gap-8">
               <div className="space-y-8">
                  {/* Form Card */}
                  <form onSubmit={handleSubmit} className="card p-8 md:p-10 rounded-[40px] shadow-xl border border-[var(--border-color)]">
                     <div className="space-y-10">
                        {/* Basic Info */}
                        <div className="space-y-6">
                           <h3 className="text-xl font-black text-[var(--text-primary)] border-r-4 border-[var(--brand-primary)] pr-4">المعلومات الأساسية</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-sm font-black text-[var(--text-secondary)] pr-2" htmlFor="username">اسم المستخدم</label>
                                 <input 
                                   id="username"
                                   type="text" 
                                   className="input-field h-14 rounded-2xl" 
                                   placeholder={user?.username || "اسم المستخدم الجديد"}
                                   value={formData.username}
                                   onChange={e => setFormData({...formData, username: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-black text-[var(--text-secondary)] pr-2" htmlFor="email_ro">البريد الإلكتروني</label>
                                 <input 
                                   id="email_ro"
                                   type="email" 
                                   className="input-field h-14 rounded-2xl opacity-50 cursor-not-allowed bg-[var(--bg-secondary)]" 
                                   value={user?.email || ""} 
                                   readOnly 
                                 />
                              </div>
                           </div>
                        </div>

                        <hr className="border-[var(--border-color)] opacity-50" />

                        {/* Security */}
                        <div className="space-y-6">
                           <h3 className="text-xl font-black text-[var(--text-primary)] border-r-4 border-amber-500 pr-4">تغيير كلمة المرور</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-sm font-black text-[var(--text-secondary)] pr-2" htmlFor="new_pass">كلمة المرور الجديدة</label>
                                 <input id="new_pass" type="password" className="input-field h-14 rounded-2xl" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-black text-[var(--text-secondary)] pr-2" htmlFor="curr_pass">كلمة المرور الحالية</label>
                                 <input id="curr_pass" type="password" className="input-field h-14 rounded-2xl" placeholder="مطلوب لتأكيد التغيير" value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})} required={formData.password !== ''} />
                              </div>
                           </div>
                        </div>

                        <button 
                          type="submit" 
                          disabled={saving}
                          className="w-full bg-[var(--brand-primary)] text-white font-black py-5 rounded-[22px] text-lg shadow-xl shadow-purple-500/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                        >
                          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات الجديدة 🔒'}
                        </button>
                     </div>
                  </form>

                  {/* Tiers Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
                     {TIERS.slice(1, 4).map((t, idx) => (
                        <div key={idx} className="card p-6 rounded-[30px] border border-[var(--border-color)] bg-white/5 relative overflow-hidden text-center group">
                           <img src={t.icon} className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform" alt={t.name} />
                           <h4 className="font-black text-[var(--text-primary)] mb-1">باقة {t.name}</h4>
                           <p className="text-[var(--text-tertiary)] text-xs font-bold">خصم {t.discount} دائم</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-6">
                  {/* Stats Sidebar */}
                  <div className="card p-8 rounded-[40px] bg-gradient-to-br from-indigo-900 to-black text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary)]/20 blur-3xl rounded-full"></div>
                     <h3 className="text-lg font-black mb-6 relative z-10">بطاقة العضوية 🎖️</h3>
                     
                     <div className="space-y-6 relative z-10">
                        <div>
                           <p className="text-white/40 text-[0.65rem] font-bold uppercase mb-1">المستوى الحالي</p>
                           <p className="text-[1.4rem] font-black text-amber-400">{user?.role === 'admin' ? 'إداري ملكي 👑' : 'عضو فضي'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-white/40 text-[0.65rem] font-bold uppercase mb-1">النقاط مجمعة</p>
                              <p className="font-black text-xl">{(user as any)?.points || 0}</p>
                           </div>
                           <div>
                              <p className="text-white/40 text-[0.65rem] font-bold uppercase mb-1">تاريخ البدء</p>
                              <p className="font-black text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '---'}</p>
                           </div>
                        </div>
                        <hr className="border-white/10" />
                        <div className="p-4 rounded-2xl bg-white/5 text-[0.75rem] font-bold leading-relaxed text-white/70">
                           نظام VIP الجديد يوفر لك خصومات تلقائية تبدأ من وصولك لإنفاق 25 ريال فقط في الموقع. شجعنا بنشر رابطك الخاص!
                        </div>
                     </div>
                  </div>

                  <div className="card p-8 rounded-[40px] border-2 border-dashed border-[var(--border-color)]">
                     <h4 className="font-black text-[var(--text-primary)] mb-4">هل تحتاج مساعدة؟</h4>
                     <p className="text-[var(--text-secondary)] text-sm font-bold mb-6">فريق الدعم الفني متواجد لمساعدتك في تحديث بياناتك أو حل أي مشكلة تواجهك في الحساب.</p>
                     <Link href="/dashboard/support" className="block text-center py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-black rounded-2xl no-underline hover:bg-[var(--border-color)] transition-all">
                        تحدث مع الدعم الفني 🎧
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>

      {unlockedTier && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
             <div className="bg-[#0a0a0c] p-10 rounded-[4rem] border-4 border-yellow-400 max-w-md w-full text-center shadow-2xl animate-zoom-in">
                <img src={unlockedTier.icon} className="w-40 h-40 mx-auto mb-8 animate-bounce" alt="Gift" />
                <h2 className="text-3xl font-black text-white mb-2">مبروك العضوية! 🎉</h2>
                <p className="text-yellow-400 font-black text-xl mb-10">أصبحت الآن في مستوى: {unlockedTier.name}</p>
                <button onClick={() => setUnlockedTier(null)} className="w-full bg-yellow-400 text-black font-black py-5 rounded-[2rem] text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">تم الاستلام ✅</button>
             </div>
          </div>
      )}

      {saving && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/80 backdrop-blur-md">
           <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white font-black text-xl tracking-widest uppercase">UPDATING PROFILE...</p>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @keyframes zoom-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-zoom-in { animation: zoom-in 0.4s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards; }
      `}</style>
    </>
  );
}
