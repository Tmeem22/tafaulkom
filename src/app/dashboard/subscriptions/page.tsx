"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';
import { useCurrency } from '@/components/CurrencyProvider';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'الاشتراكات الذكية', href: '/dashboard/subscriptions', icon: 'https://img.icons8.com/fluency/256/subscription.png', active: true },
  { label: 'باقات المشاهير', href: '/dashboard/packages', icon: 'https://img.icons8.com/fluency/256/star.png' },
  { label: 'الطلب الجماعي', href: '/dashboard/mass-order', icon: 'https://img.icons8.com/fluency/256/add-list.png' },
  { label: 'سلة المشتريات', href: '/dashboard/cart', icon: 'https://img.icons8.com/color/96/shopping-basket.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'الربط البرمجي (API)', href: '/dashboard/api-docs', icon: 'https://img.icons8.com/fluency/256/api.png' },
];

export default function SubscriptionsPage() {
  const { currency, formatPrice } = useCurrency();
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState<number | ''>('');
  const [minQty, setMinQty] = useState<number | ''>('');
  const [maxQty, setMaxQty] = useState<number | ''>('');
  const [delay, setDelay] = useState<number | ''>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setServices(data);
          const cats = Array.from(new Set(data.map((s: any) => s.category))) as string[];
          setCategories(cats);
        }
      });
  }, []);

  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value);
    setSelectedService(null);
  };

  const filteredServices = services.filter(s => s.category === selectedCategory);

  const calculateCharge = () => {
    if (!selectedService || !posts || !maxQty) return 0;
    const totalMaxQuantity = Number(posts) * Number(maxQty);
    return (totalMaxQuantity / 1000) * selectedService.rate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !username || !posts || !minQty || !maxQty) {
      showToast('الرجاء إكمال كافة الحقول الأساسية', 'error');
      return;
    }

    if (Number(minQty) > Number(maxQty)) {
      showToast('الكمية الأدنى يجب أن تكون أقل أو تساوي الكمية الأقصى', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          username: username,
          posts: Number(posts),
          minQty: Number(minQty),
          maxQty: Number(maxQty),
          delay: delay ? Number(delay) : 0,
          isSubscription: true
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast('تم تفعيل الاشتراك بنجاح!', 'success');
        setUsername('');
        setPosts('');
        setMinQty('');
        setMaxQty('');
        setDelay('');
      } else {
        showToast(data.error || 'حدث خطأ', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        {/* Sidebar */}
        <aside className="w-[280px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 fixed top-[70px] bottom-0 overflow-y-auto hidden lg:flex flex-col gap-2">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-4 rounded-[20px] no-underline flex items-center gap-4 text-[0.85rem] font-black transition-all ${l.active ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} width={24} height={24} alt={l.label} className={l.active ? 'brightness-0 invert' : ''} />
              {l.label}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:mr-[280px] p-4 lg:p-12 pb-24">
          <div className="max-w-[700px] mx-auto animate-fade-in-up">
            
            <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] mb-2 flex items-center gap-4">
              <img src="https://img.icons8.com/fluency/256/subscription.png" width={48} height={48} alt="Sub" />
              الاشتراكات التلقائية (Auto-Pilot) 🚀
            </h1>
            <p className="text-[1.1rem] text-[var(--text-secondary)] font-bold mb-8">
              لا تتعب نفسك بطلب الإعجابات في كل مرة تنزل فيها مقطع. ضع اشتراكك، وسنقوم باللازم تلقائياً فور نزول مقطعك!
            </p>

            <form onSubmit={handleSubmit} className="card p-8 rounded-[30px] border border-[var(--border-color)] shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[0.95rem] font-black text-[var(--text-primary)]">اختر المنصة / القسم</label>
                   <select 
                     value={selectedCategory} 
                     onChange={handleCategoryChange}
                     className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[16px] p-4 focus:border-[var(--brand-primary)] outline-none transition-all font-bold"
                   >
                     <option value="">-- اختر القسم --</option>
                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-[0.95rem] font-black text-[var(--text-primary)]">اختر خدمة الاشتراك</label>
                   <select 
                     value={selectedService?.id || ''} 
                     onChange={(e) => {
                       const srv = services.find(s => s.id === Number(e.target.value));
                       setSelectedService(srv);
                     }}
                     disabled={!selectedCategory}
                     className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[16px] p-4 focus:border-[var(--brand-primary)] outline-none transition-all font-bold disabled:opacity-50"
                   >
                     <option value="">-- اختر الخدمة --</option>
                     {filteredServices.map(s => (
                       <option key={s.id} value={s.id}>{s.name} ({formatPrice(s.rate)} لكل ألف)</option>
                     ))}
                   </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[0.95rem] font-black text-[var(--text-primary)]">اسم المستخدم الحساب (Username)</label>
                 <input 
                   type="text" 
                   required
                   placeholder="@username"
                   dir="ltr"
                   value={username}
                   onChange={e => setUsername(e.target.value)}
                   className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[16px] p-4 focus:border-[var(--brand-primary)] outline-none transition-all font-mono"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[0.95rem] font-black text-[var(--text-primary)]">عدد المقاطع القادمة ليدعمها (Posts)</label>
                   <input type="number" required min="1" max="1000" placeholder="مثال: 10 مقاطع" value={posts} onChange={e => setPosts(Number(e.target.value) || '')} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[16px] p-4 border-l-[6px]" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[0.95rem] font-black text-[var(--text-primary)]">مدة التأخير (بالدقائق) (اختياري)</label>
                   <input type="number" min="0" placeholder="مثال: 15 دقيقة بعد النشر" value={delay} onChange={e => setDelay(Number(e.target.value) || '')} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[16px] p-4" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                 <div className="space-y-2">
                   <label className="text-[0.95rem] font-black text-blue-500">الحد الأدنى للتفاعل لكل مقطع</label>
                   <input type="number" required min={selectedService?.min || 10} placeholder="مثال: 500" value={minQty} onChange={e => setMinQty(Number(e.target.value) || '')} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[16px] p-4 font-bold" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[0.95rem] font-black text-blue-500">الحد الأقصى للتفاعل لكل مقطع</label>
                   <input type="number" required min={selectedService?.min || 10} placeholder="مثال: 1000" value={maxQty} onChange={e => setMaxQty(Number(e.target.value) || '')} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[16px] p-4 font-bold" />
                 </div>
              </div>

              {selectedService && posts && maxQty && (
                <div className="p-6 rounded-[20px] bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-center">
                   <p className="text-[0.9rem] text-[var(--text-secondary)] font-bold mb-2">إجمالي التكلفة المتوقعة (بناءً على الحد الأقصى)</p>
                   <p className="text-[2rem] font-black text-[var(--brand-primary)] dir-ltr flex justify-center gap-2">
                      {formatPrice(calculateCharge())}
                   </p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting || !selectedService}
                className="w-full btn-primary py-5 rounded-[20px] font-black text-[1.1rem] shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {isSubmitting ? 'جاري تفعيل الاشتراك العبقري...' : 'تفعيل الاشتراك الآن 🚀'}
              </button>

            </form>

          </div>
        </div>
      </div>
    </>
  );
}
