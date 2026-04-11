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
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png', active: true },
];

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/inventory')
      .then(r => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUseItem = async () => {
    if (!link) return showToast("الرجاء إدخال الرابط أولاً", "error");
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/inventory/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: selectedItem.id, link })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "تم تنفيذ جائزتك بنجاح!", "success");
        setSelectedItem(null);
        setLink('');
        fetchItems();
      } else {
        showToast(data.error || "فشل تنفيذ الجائزة", "error");
      }
    } catch (err) {
      showToast("خطأ في الاتصال بالسيرفر", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getLinkHint = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('متابع') || n.includes('مشترك') || n.includes('عضو')) return { label: 'رابط الحساب أو القناة', placeholder: 'مثال: https://instagram.com/username' };
    if (n.includes('مشاهدة') || n.includes('لايك') || n.includes('ريتويت') || n.includes('إعجاب') || n.includes('فيديو')) return { label: 'رابط المنشور أو المقطع', placeholder: 'مثال: https://tiktok.com/@user/video/123' };
    return { label: 'الرابط المطلوب', placeholder: 'أدخل الرابط هنا...' };
  };

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        <aside className="w-[280px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-8 fixed top-[70px] bottom-0 overflow-y-auto hidden lg:flex flex-col gap-2">
           <div className="mb-8 px-4">
              <h3 className="text-[0.65rem] uppercase tracking-widest text-[var(--text-tertiary)] font-black mb-4">القائمة الرئيسية</h3>
           </div>
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-4 rounded-[20px] no-underline flex items-center justify-between gap-4 text-[0.85rem] font-black transition-all group ${l.active ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-purple-500/30 animate-scale-in' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}>
              <div className="flex items-center gap-4">
                <img src={l.icon} width={24} height={24} alt={l.label} className={l.active ? 'brightness-0 invert' : 'group-hover:scale-110 transition-transform'} />
                {l.label}
              </div>
            </Link>
          ))}
        </aside>

        <main className="flex-1 lg:mr-[280px] p-6 lg:p-12">
          <div className="max-w-[1200px] mx-auto">
             
            <div className="relative mb-14 p-10 rounded-[40px] bg-gradient-to-l from-[var(--brand-primary)] to-indigo-600 text-white overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <div className="relative z-10">
                  <h1 className="text-4xl font-black mb-3">خزنتي وسلة الجوائز 🧺</h1>
                  <p className="text-white/80 font-bold max-w-[500px] leading-relaxed">هنا يتم تخزين كل ما كسبته من صالة الألعاب. يمكنك اختيار الوقت المناسب لتنفيذ هداياك ووضع الرابط الذي تريده.</p>
               </div>
               <img src="https://img.icons8.com/fluency/512/treasure-chest--v1.png" className="absolute -bottom-10 -left-10 w-64 opacity-20 pointer-events-none" alt="زينة الخزنة" />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-32 gap-6">
                <div className="w-16 h-16 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-[var(--text-secondary)]">جاري جلب ممتلكاتك الثمينة...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="card text-center p-24 rounded-[50px] border-2 border-dashed border-[var(--border-color)] bg-white/50 backdrop-blur-sm">
                <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <img src="https://img.icons8.com/fluency/256/empty-box.png" width={80} height={80} className="grayscale opacity-40" alt="صندوق فارغ" />
                </div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">الخزنة فارغة حالياً!</h2>
                <p className="text-[var(--text-secondary)] font-bold mb-10 text-lg">لم تفز بأي جوائز بعد؟ صالة الألعاب تنتظرك لتصنع مجدك!</p>
                <Link href="/dashboard/games" className="inline-flex items-center gap-3 bg-[var(--brand-primary)] text-white px-10 py-5 rounded-[24px] font-black text-xl no-underline shadow-2xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all">
                   🚀 اذهب لصالة الألعاب
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {items.map(item => (
                  <div key={item.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)] to-blue-600 rounded-[35px] blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                    <div className="card p-8 rounded-[35px] border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--brand-primary)]/50 transition-all relative overflow-hidden h-full flex flex-col">
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          <img 
                            src={item.type === 'MYSTERY_BOX' ? 'https://img.icons8.com/fluency/256/treasure-chest.png' : 'https://img.icons8.com/fluency/256/auction.png'} 
                            width={32} 
                            height={32}
                            alt="أيقونة الجائزة" 
                          />
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[0.65rem] font-bold border border-[var(--border-color)]">
                          {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-[var(--text-primary)] mb-3">{item.name}</h3>
                      <p className="text-[var(--text-secondary)] text-sm font-semibold mb-8 flex-1 leading-relaxed">{item.description}</p>
                      
                      <div className="pt-6 border-t border-[var(--border-color)]/60">
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className="w-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-black py-4 rounded-2xl hover:bg-[var(--brand-primary)] hover:text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          استلام الجائزة الآن
                          <span className="group-hover/btn:translate-x-[-4px] transition-transform">🚀</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Use Item Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedItem(null)}></div>
            <div className="card w-full max-w-[500px] p-10 rounded-[45px] relative z-10 shadow-3xl animate-zoom-in">
                <button onClick={() => setSelectedItem(null)} className="absolute top-6 left-6 text-[var(--text-tertiary)] hover:text-red-500 transition-colors" title="إغلاق">
                   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                <div className="text-center mb-10">
                   <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <img src="https://img.icons8.com/fluency/256/gift.png" width={48} height={48} alt="هدية" />
                   </div>
                   <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">تأكيد طلب الهدية</h2>
                   <p className="text-[var(--text-secondary)] font-bold">{selectedItem.name}</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[0.9rem] font-black text-[var(--text-primary)] px-2">{getLinkHint(selectedItem.name).label}</label>
                      <input 
                        type="text" 
                        value={link} 
                        onChange={e => setLink(e.target.value)}
                        placeholder={getLinkHint(selectedItem.name).placeholder}
                        className="input-field py-5 text-left font-bold"
                        dir="ltr"
                      />
                   </div>

                   <button 
                     onClick={handleUseItem}
                     disabled={submitting || !link}
                     className="w-full bg-[var(--brand-primary)] text-white font-black py-5 rounded-[22px] text-lg shadow-xl shadow-purple-500/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
                   >
                     {submitting ? 'جاري التنفيذ...' : 'تأكيد التنفيذ فوراً ⚡'}
                   </button>
                </div>

                <p className="mt-8 text-[var(--text-tertiary)] text-[0.7rem] text-center font-bold px-4">
                   تأكد من أن الرابط صحيح وحسابك عام (Public). التنفيذ يتم آلياً ولا يمكن التراجع بعد الضغط.
                </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
