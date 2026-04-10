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
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png', active: true },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
];

export default function PointsPage() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [uRes, tRes] = await Promise.all([
        fetch('/api/user/me'),
        fetch('/api/user/points-tasks')
      ]);
      const userData = await uRes.json();
      const taskData = await tRes.json();
      setUser(userData);
      setTasks(taskData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/user/points-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('تم إرسال رابط الفيديو وفتح تذكرة دعم بنجاح! بانتظار المراجعة.', 'success');
        setVideoUrl('');
        fetchData();
      } else {
        showToast(data.error || 'فشل في الإرسال', 'error');
      }
    } catch (e) {
      showToast('حدث خطأ في الاتصال', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="flex-1 md:mr-[250px] p-6 lg:p-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="mb-10">
              <h1 className="text-[2.5rem] font-black text-[var(--text-primary)] mb-4 flex items-center gap-4">
                <img src="https://img.icons8.com/fluency/256/coins.png" width={56} height={56} alt="Points" />
                نظام المكافآت والنقاط
              </h1>
              <p className="text-[1.1rem] text-[var(--text-secondary)] font-bold">كل 500 نقطة تساوي 0.50$ تضاف لرصيدك تلقائياً!</p>
            </div>

            {/* Current Balance Card */}
            <div className="card p-8 bg-[var(--gradient-primary)] text-white rounded-[32px] shadow-xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
               <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12">
                  <img src="https://img.icons8.com/fluency/512/coins.png" width={300} alt="bg" />
               </div>
               <div className="relative z-10 text-center md:text-right">
                  <p className="text-white/80 font-bold uppercase tracking-widest mb-2 text-[0.8rem]">رصيد نقاطك الحالي</p>
                  <p className="text-[4rem] font-black leading-none">{user?.points || 0}</p>
                  <p className="mt-4 text-[0.9rem] bg-white/20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">نقطة مكافأة متوفرة</p>
               </div>
               <div className="relative z-10">
                  <button className="px-10 py-5 bg-white text-[var(--brand-primary)] font-black rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50" disabled={(user?.points || 0) < 500}>
                    استبدال النقاط الآن 🪙
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* How to collect */}
              <div className="space-y-6">
                <h2 className="text-[1.5rem] font-black border-r-4 border-amber-500 pr-4">كيف تجمع النقاط؟</h2>
                
                <div className="card p-6 border-r-4 border-emerald-500 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src="https://img.icons8.com/fluency/256/shopping-cart.png" width={32} />
                    <h3 className="font-black text-[1.1rem]">1. عبر الطلبات (تلقائياً)</h3>
                  </div>
                  <ul className="text-[0.9rem] text-[var(--text-secondary)] font-bold space-y-2 list-none p-0">
                    <li className="flex gap-2">✅ أي طلب بأقل من <span className="text-emerald-500">10 ر.س</span> يمنحك <span className="text-[var(--text-primary)]">10 نقاط</span></li>
                    <li className="flex gap-2">✅ أي طلب بـ <span className="text-emerald-500">10 ر.س</span> أو أكثر يمنحك <span className="text-[var(--text-primary)]">50 نقطة</span></li>
                  </ul>
                </div>

                <div className="card p-6 border-r-4 border-blue-500 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src="https://img.icons8.com/fluency/256/video.png" width={32} />
                    <h3 className="font-black text-[1.1rem]">2. صانع المحتوى (250 نقطة)</h3>
                  </div>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed">
                    قم بتصوير فيديو (تيك توك أو يوتيوب) تشرح فيه الموقع وتجربتك معنا وانشره، وسنمنحك 250 نقطة مكافأة!
                  </p>
                  <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                     <p className="text-[0.75rem] text-blue-600 font-bold">⚠️ شروط الفيديوهات:</p>
                     <ul className="text-[0.7rem] list-disc pr-4 mt-2 space-y-1 text-[var(--text-secondary)]">
                       <li>يمكنك إرسال فيديوهين فقط كحد أقصى كل أسبوعين.</li>
                       <li>يجب أن يكون الفيديو واضحاً ويشرح خدمات الموقع.</li>
                       <li>سيتم مراجعة الفيديو من قبل المطور خلال 24 ساعة.</li>
                     </ul>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="space-y-6">
                <h2 className="text-[1.5rem] font-black border-r-4 border-amber-500 pr-4">إرسال فيديو جديد</h2>
                <div className="card p-8">
                  <form onSubmit={handleSubmitVideo} className="space-y-4">
                    <div>
                      <label className="block text-[0.85rem] font-black mb-3">رابط الفيديو (TikTok / YouTube)</label>
                      <input 
                        type="url" 
                        className="input-field p-4 rounded-2xl" 
                        placeholder="https://..." 
                        dir="ltr" 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={submitting || !videoUrl}
                      className="w-full py-4 bg-[var(--brand-primary)] text-white font-black rounded-2xl shadow-lg hover:brightness-110 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {submitting ? 'جاري الإرسال...' : 'إرسال للمراجعة وفتح تذكرة'}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="font-black">طلباتك السابقة</h3>
                  <div className="flex flex-col gap-3">
                    {tasks.length === 0 ? (
                      <p className="text-center py-8 text-[var(--text-tertiary)] font-bold italic">لم تقم بإرسال أي فيديوهات بعد</p>
                    ) : (
                      tasks.map((t, i) => (
                        <div key={i} className="card p-4 flex justify-between items-center transition-all hover:bg-[var(--bg-secondary)]">
                          <div className="truncate max-w-[200px]">
                            <p className="text-[0.8rem] font-black truncate" dir="ltr">{t.videoUrl}</p>
                            <p className="text-[0.65rem] text-[var(--text-tertiary)]">{new Date(t.createdAt).toLocaleDateString('ar-EG')}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[0.7rem] font-black ${
                            t.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                            t.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {t.status === 'APPROVED' ? 'مقبول' : t.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
