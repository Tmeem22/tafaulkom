"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';

interface Service {
  id: number;
  name: string;
  category: string;
}

export default function AdminGames() {
  const [formData, setFormData] = useState({
    type: 'REVERSE_AUCTION',
    title: '',
    prizeDescription: '',
    startPrice: 50,
    minPrice: 5,
    dropAmount: 0.5,
    dropIntervalSeconds: 5,
    delayMinutes: 5,
    durationMinutes: 60,
    serviceId: '',
    quantity: 1000
  });

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
          const cats = Array.from(new Set(data.map(s => s.category)));
          setCategories(cats);
        }
      })
      .catch(() => {})
      .finally(() => setFetchingServices(false));
  }, []);

  const filteredServices = selectedCategory 
    ? services.filter(s => s.category === selectedCategory)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceId) {
      showToast("يجب اختيار الخدمة المرتبطة بالمزاد", "error");
      return;
    }
    setLoading(true);

    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + Number(formData.delayMinutes));

    try {
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          serviceId: Number(formData.serviceId),
          startTime: startTime.toISOString() 
        })
      });
      const data = await res.json();

      if (res.ok) {
        showToast("تم جدولة المزاد بنجاح!", "success");
        setFormData({
          type: 'REVERSE_AUCTION',
          title: '',
          prizeDescription: '',
          startPrice: 50,
          minPrice: 5,
          dropAmount: 0.5,
          dropIntervalSeconds: 5,
          delayMinutes: 5,
          durationMinutes: 60,
          serviceId: '',
          quantity: 1000
        });
        setSelectedCategory('');
      } else {
        showToast(data.error || "فشل الجدولة", "error");
      }
    } catch (err) {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" dir="rtl">
       <div className="mb-8 p-10 bg-gradient-to-l from-indigo-700 to-purple-600 rounded-[35px] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
          <h1 className="text-4xl font-black mb-3">🎮 التحكم في صالة الألعاب</h1>
          <p className="text-white/80 font-bold max-w-2xl text-lg">تحكم في أنواع المزادات، التحديات، والجوائز المتاحة للمستخدمين لزيادة النشاط والتفاعل.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Creation Form */}
         <div className="card rounded-[40px] p-10 border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl relative">
           
           <div className="flex gap-4 mb-10 p-2 bg-[var(--bg-secondary)] rounded-2xl">
              <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'REVERSE_AUCTION'})}
                className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.type === 'REVERSE_AUCTION' ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)]'}`}
              >
                📉 مزاد عكسي (خطف)
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'STANDARD_AUCTION'})}
                className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.type === 'STANDARD_AUCTION' ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)]'}`}
              >
                📈 مزاد عادي (مزايدة)
              </button>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
             
             <div className="space-y-3">
               <label htmlFor="auction_title" className="text-[0.9rem] font-black text-[var(--text-primary)]">عنوان المزاد (يظهر للعميل)</label>
               <input id="auction_title" type="text" className="input-field py-4" placeholder="مثال: باقة النخبة لإنستغرام" title="عنوان المزاد" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="cat_select" className="text-[0.9rem] font-black text-[var(--text-primary)]">المنصة</label>
                  <select id="cat_select" className="input-field py-4 cursor-pointer" title="اختر المنصة" value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setFormData({...formData, serviceId: ''}); }}>
                    <option value="">اختر المنصة...</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label htmlFor="service_select" className="text-[0.9rem] font-black text-[var(--text-primary)]">الخدمة</label>
                  <select id="service_select" className="input-field py-4 cursor-pointer" title="اختر الخدمة" required disabled={!selectedCategory} value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})}>
                    <option value="">{selectedCategory ? 'اختر الخدمة...' : 'اختر المنصة أولاً'}</option>
                    {filteredServices.map(s => <option key={s.id} value={s.id}>[{s.id}] {s.name}</option>)}
                  </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label htmlFor="grant_qty" className="text-[0.9rem] font-black text-[var(--text-primary)]">الكمية المهداة</label>
                   <input id="grant_qty" type="number" className="input-field py-4" title="الكمية المهداة" placeholder="الكمية" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                </div>
                {formData.type === 'REVERSE_AUCTION' ? (
                   <div className="space-y-3">
                     <label htmlFor="drop_interval" className="text-[0.9rem] font-black text-[var(--text-primary)]">وقت النزول (ثانية)</label>
                     <input id="drop_interval" type="number" className="input-field py-4" title="وقت النزول بالثواني" placeholder="ثواني" required value={formData.dropIntervalSeconds} onChange={e => setFormData({...formData, dropIntervalSeconds: Number(e.target.value)})} />
                   </div>
                ) : (
                   <div className="space-y-3">
                     <label htmlFor="auc_duration" className="text-[0.9rem] font-black text-[var(--text-primary)]">مدة المزاد (دقيقة)</label>
                     <input id="auc_duration" type="number" className="input-field py-4 border-emerald-500/30 bg-emerald-500/5" title="مدة المزاد بالدقائق" placeholder="دقائق" required value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})} />
                   </div>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="start_delay" className="text-[0.9rem] font-black text-amber-500">بداية العرض (دقيقة من الآن)</label>
                  <input id="start_delay" type="number" className="input-field py-4 bg-amber-500/5 border-amber-500/30" title="وقت التأخير قبل البدء" placeholder="دقائق" required value={formData.delayMinutes} onChange={e => setFormData({...formData, delayMinutes: Number(e.target.value)})} />
                </div>
                <div className="space-y-3">
                  <label htmlFor="start_price" className="text-[0.9rem] font-black text-[var(--text-primary)]">{formData.type === 'REVERSE_AUCTION' ? 'بداية السعر ($)' : 'أول مزايدة ($)'}</label>
                  <input id="start_price" type="number" step="0.01" className="input-field py-4" title="سعر البداية" placeholder="سعر" required value={formData.startPrice} onChange={e => setFormData({...formData, startPrice: Number(e.target.value)})} />
                </div>
             </div>

             {formData.type === 'REVERSE_AUCTION' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label htmlFor="min_price" className="text-[0.8rem] font-black text-[var(--text-primary)]">الحد الأدنى ($)</label>
                    <input id="min_price" type="number" step="0.01" className="input-field py-4" title="الحد الأدنى للسعر" placeholder="سعر" required value={formData.minPrice} onChange={e => setFormData({...formData, minPrice: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="drop_amt" className="text-[0.8rem] font-black text-[var(--text-primary)]">مبلغ الخصم ($)</label>
                    <input id="drop_amt" type="number" step="0.01" className="input-field py-4" title="مبلغ الخصم عند التكرار" placeholder="خصم" required value={formData.dropAmount} onChange={e => setFormData({...formData, dropAmount: Number(e.target.value)})} />
                  </div>
                </div>
             )}

             <div className="space-y-3">
               <label htmlFor="prize_desc" className="text-[0.9rem] font-black text-[var(--text-primary)]">وصف الجائزة</label>
               <textarea id="prize_desc" className="input-field min-h-[100px] py-4" placeholder="اكتب تفاصيل الإغراء هنا..." title="وصف الجائزة" required value={formData.prizeDescription} onChange={e => setFormData({...formData, prizeDescription: e.target.value})} />
             </div>

             <button type="submit" disabled={loading} className="w-full bg-[var(--brand-primary)] text-white font-black py-6 rounded-[25px] shadow-2xl shadow-purple-500/30 hover:brightness-110 active:scale-95 transition-all text-xl disabled:opacity-50 mt-4">
               {loading ? 'جاري الجدولة...' : 'طرح التحدي الآن 🔥'}
             </button>
           </form>
         </div>

         {/* Info Helper */}
         <div className="space-y-8">
            <div className="card rounded-[40px] p-10 border border-[var(--border-color)] bg-[var(--bg-card)]">
               <h3 className="font-black text-2xl mb-8 flex items-center gap-3">
                 <span>💡</span> {formData.type === 'REVERSE_AUCTION' ? 'مزاد الخطف (العكسي)' : 'مزاد المزايدة (العادي)'}
               </h3>
               {formData.type === 'REVERSE_AUCTION' ? (
                 <p className="text-[var(--text-secondary)] font-bold leading-relaxed">
                   في هذا المزاد، ينقص السعر تلقائياً مع مرور الوقت. الهدف هو أن يضغط العميل "خطف" قبل غيره بأقل سعر ممكن. 
                   <br/><br/>
                   مناسب جداً لتنشيط الموقع في أوقات الذروة وخلق حماس بين المستخدمين.
                 </p>
               ) : (
                 <p className="text-[var(--text-secondary)] font-bold leading-relaxed">
                   هنا يقوم المستخدمون برفع السعر تدريجياً. صاحب أعلى مزايدة عند نهاية وقت المزاد هو الفائز. 
                   <br/><br/>
                   سيتم سحب مبلغ المزايدة من رصيد العميل فورياً، وإذا قام شخص آخر بالمزايدة عليه، سيتم إعادة المبلغ لرصيد العميل الأول أوتوماتيكياً.
                 </p>
               )}
            </div>
         </div>
       </div>
    </div>
  );
}
