"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';
import { useCurrency } from '@/components/CurrencyProvider';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'الاشتراكات الذكية', href: '/dashboard/subscriptions', icon: 'https://img.icons8.com/fluency/256/subscription.png' },
  { label: 'باقات المشاهير', href: '/dashboard/packages', icon: 'https://img.icons8.com/fluency/256/star.png', active: true },
  { label: 'الطلب الجماعي', href: '/dashboard/mass-order', icon: 'https://img.icons8.com/fluency/256/add-list.png' },
  { label: 'سلة المشتريات', href: '/dashboard/cart', icon: 'https://img.icons8.com/color/96/shopping-basket.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'الربط البرمجي (API)', href: '/dashboard/api-docs', icon: 'https://img.icons8.com/fluency/256/api.png' },
];

export default function PackagesPage() {
  const { currency, formatPrice } = useCurrency();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Purchase Modal
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [linkInput, setLinkInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(d => {
        setPackages(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg || !linkInput.trim()) return;

    if (!confirm('سيتم خصم قيمة الباقة من رصيدك والبدء بالتنفيذ فوراً. هل أنت متأكد؟')) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selectedPkg.id, link: linkInput.trim() })
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message, 'success');
        setSelectedPkg(null);
        setLinkInput('');
      } else {
        showToast(data.error || 'فشلت العملية', 'error');
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        <aside className="w-[280px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 fixed top-[70px] bottom-0 overflow-y-auto hidden lg:flex flex-col gap-2">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-4 rounded-[20px] no-underline flex items-center gap-4 text-[0.85rem] font-black transition-all ${l.active ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} width={24} height={24} alt={l.label} className={l.active ? 'brightness-0 invert' : ''} />
              {l.label}
            </Link>
          ))}
        </aside>

        <div className="flex-1 lg:mr-[280px] p-4 lg:p-12 pb-24">
          <div className="max-w-[1100px] mx-auto animate-fade-in-up">
            
            <div className="mb-10 text-center md:text-right">
              <h1 className="text-[2.5rem] font-black text-[var(--text-primary)] mb-2 flex items-center justify-center md:justify-start gap-4">
                <img src="https://img.icons8.com/fluency/256/star.png" width={48} height={48} alt="Star" className="animate-spin-slow" />
                باقات المشاهير (VIP) 💎
              </h1>
              <p className="text-[1.1rem] text-[var(--text-secondary)] font-bold">
                ريح رأسك من تجميع الخدمات. باقات سحرية جاهزة بضغطة زر واحدة تجعل حسابك يطير في الاكسبلور!
              </p>
            </div>

            {loading ? (
               <div className="flex justify-center items-center h-[30vh]">
                  <div className="w-12 h-12 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {packages.map((pkg) => (
                   <div key={pkg.id} className="card p-0 overflow-hidden border border-[var(--border-color)] group hover:border-[var(--brand-primary)]/50 transition-all shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-xl)] flex flex-col relative">
                     <div className="absolute top-0 right-0 w-full h-[6px] bg-gradient-to-r from-[var(--brand-primary)] to-blue-500"></div>
                     <div className="p-8 pb-6 flex-1 flex flex-col">
                        <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                          <img src={pkg.icon} width={45} height={45} alt={pkg.name} />
                        </div>
                        <h2 className="text-[1.3rem] font-black text-[var(--text-primary)] mb-3">{pkg.name}</h2>
                        <p className="text-[0.9rem] text-[var(--text-secondary)] font-medium leading-relaxed flex-1">
                          {pkg.description}
                        </p>
                     </div>
                     <div className="bg-[var(--bg-secondary)]/50 p-6 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div>
                          <p className="text-[0.65rem] font-black text-[var(--text-tertiary)] uppercase tracking-wider mb-1">السعر الإجمالي</p>
                          <p className="text-[1.4rem] font-black text-[var(--brand-primary)] dir-ltr leading-none">
                            {formatPrice(pkg.price)}
                          </p>
                        </div>
                        <button 
                          onClick={() => setSelectedPkg(pkg)}
                          className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-2xl font-black text-[0.9rem] hover:opacity-80 transition-opacity"
                        >
                          شراء الباقة
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-right" dir="rtl" onClick={() => !isSubmitting && setSelectedPkg(null)}>
          <div className="bg-[var(--bg-card)] max-w-[500px] w-full rounded-[30px] shadow-2xl p-8 border border-[var(--border-color)] animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">{selectedPkg.name}</h2>
                <img src={selectedPkg.icon} width={40} height={40} alt={selectedPkg.name} />
             </div>
             <p className="text-[0.95rem] text-[var(--text-secondary)] mb-6 leading-relaxed">
               {selectedPkg.description}
             </p>
             
             <div className="p-4 rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-black flex justify-between items-center mb-6">
                <span>تأكيد السعر المجمع:</span>
                <span className="text-[1.3rem] dir-ltr">{formatPrice(selectedPkg.price)}</span>
             </div>

             <form onSubmit={handlePurchase} className="flex flex-col gap-4">
                <div className="space-y-2">
                   <label className="text-[0.9rem] font-black text-[var(--text-primary)]">أدخل البيانات المطلوبة ({selectedPkg.requires})</label>
                   <input 
                     type="text" 
                     required
                     autoFocus
                     dir="ltr"
                     value={linkInput}
                     onChange={e => setLinkInput(e.target.value)}
                     className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl p-4 focus:border-[var(--brand-primary)] outline-none transition-all font-mono"
                     placeholder={selectedPkg.requires.includes('رابط') ? 'https://...' : '@username'}
                   />
                </div>
                
                <div className="flex gap-4 mt-4">
                   <button 
                     type="submit" 
                     disabled={isSubmitting || !linkInput.trim()}
                     className="flex-1 btn-primary py-4 rounded-xl font-black text-[1rem] shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                   >
                     {isSubmitting ? 'جاري التنفيذ والتوزيع...' : 'إتمام الشراء وبدء العمل'}
                   </button>
                   <button 
                     type="button" 
                     disabled={isSubmitting}
                     onClick={() => setSelectedPkg(null)}
                     className="px-6 py-4 rounded-xl font-black text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all border border-[var(--border-color)]"
                   >
                     إلغاء
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </>
  );
}
