"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCurrency } from '@/components/CurrencyProvider';

interface BundleItem {
  id: number;
  name: string;
  qty: number;
}

interface Bundle {
  id: string;
  name: string;
  category: 'followers' | 'views';
  platform: string;
  icon: string;
  color: string;
  price: number; // USD
  originalPrice: number; // USD
  items: BundleItem[];
  emoji: string;
  requires: 'username' | 'link';
}

const BUNDLES: Bundle[] = [
  // FOLLOWERS SECTION
  {
    id: 'insta-followers-starter',
    name: 'انطلاقة انستقرام (1K)',
    category: 'followers',
    platform: 'Instagram',
    icon: 'https://img.icons8.com/color/96/instagram-new.png',
    color: 'from-pink-500 to-purple-600',
    originalPrice: 15.00,
    price: 9.99, // Cost $6.6 -> Profit ~$3.4 (12.75 SAR)
    items: [{ id: 1355, name: '1,000 متابع حقيقي', qty: 1000 }],
    emoji: '📸',
    requires: 'username'
  },
  {
    id: 'tiktok-followers-starter',
    name: 'بداية تيك توك (5K)',
    category: 'followers',
    platform: 'TikTok',
    icon: 'https://img.icons8.com/color/96/tiktok.png',
    color: 'from-[#fe2c55] to-[#25f4ee]',
    originalPrice: 18.00,
    price: 12.50, // Cost ~7.5 -> Profit $5 (18.75 SAR)
    items: [{ id: 2614, name: '5,000 متابع', qty: 5000 }],
    emoji: '🎵',
    requires: 'username'
  },
  {
    id: 'youtube-subs-starter',
    name: 'مشتركين يوتيوب (1K)',
    category: 'followers',
    platform: 'YouTube',
    icon: 'https://img.icons8.com/color/96/youtube-play.png',
    color: 'from-red-500 to-red-700',
    originalPrice: 20.00,
    price: 14.99, // Cost ~5.0 -> Profit $10 (37.5 SAR)
    items: [{ id: 1838, name: '1,000 مشترك حقيقي', qty: 1000 }],
    emoji: '🎬',
    requires: 'link'
  },
  // VIEWS SECTION
  {
    id: 'insta-views-mega',
    name: 'مشاهدات انستقرام (50K)',
    category: 'views',
    platform: 'Instagram',
    icon: 'https://img.icons8.com/color/96/instagram-new.png',
    color: 'from-pink-400 to-orange-400',
    originalPrice: 10.00,
    price: 4.99, // Cost ~0.10 -> Massive profit
    items: [{ id: 1362, name: '50,000 مشاهدة فيديو', qty: 50000 }],
    emoji: '👀',
    requires: 'link'
  },
  {
    id: 'tiktok-views-mega',
    name: 'ترند تيك توك (100K)',
    category: 'views',
    platform: 'TikTok',
    icon: 'https://img.icons8.com/color/96/tiktok.png',
    color: 'from-gray-800 to-black',
    originalPrice: 15.00,
    price: 7.99, // Cost ~1.0 -> High profit
    items: [{ id: 1092, name: '100,000 مشاهدة سريعة', qty: 100000 }],
    emoji: '🚀',
    requires: 'link'
  },
  {
    id: 'youtube-views-boost',
    name: 'ساعات مشاهدة يوتيوب (4K)',
    category: 'views',
    platform: 'YouTube',
    icon: 'https://img.icons8.com/color/96/youtube-play.png',
    color: 'from-red-600 to-red-900',
    originalPrice: 80.00,
    price: 55.00, // High value
    items: [{ id: 1819, name: '4,000 ساعة مشاهدة حقيقية', qty: 4000 }],
    emoji: '⏱️',
    requires: 'link'
  }
];

export default function BundlesPage() {
  const { formatPrice } = useCurrency();
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBundle || !inputValue) return;

    setOrdering(true);
    setMessage({ type: '', text: '' });

    try {
      // Loop through items in the bundle and create orders
      for (const item of selectedBundle.items) {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: item.id,
            link: inputValue,
            quantity: item.qty
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل تنفيذ الطلب');
      }

      setMessage({ type: 'success', text: '✅ تم استلام طلبك للباقة وجاري التنفيذ حالياً!' });
      setInputValue('');
      setTimeout(() => setSelectedBundle(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setOrdering(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen pt-[130px] md:pt-[150px] bg-[var(--bg-secondary)] pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-16">
             <h1 className="text-[2.5rem] md:text-[3.5rem] font-black text-[var(--text-primary)] mb-4 leading-tight">
               باقات <span className="text-gradient">تفاعلكم</span> الموفرة
             </h1>
             <p className="text-[1.1rem] text-[var(--text-secondary)] font-medium max-w-[600px] mx-auto">
               اختر نوع الباقة التي تناسب هدفك وانطلق نحو الصدارة!
             </p>
          </div>

          {/* Followers Section */}
          <div className="mb-20">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)] mb-8 flex items-center gap-3">
              👥 باقات المتابعين والمشتركين
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BUNDLES.filter(b => b.category === 'followers').map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} formatPrice={formatPrice} onSelect={setSelectedBundle} />
              ))}
            </div>
          </div>

          {/* Views Section */}
          <div>
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)] mb-8 flex items-center gap-3">
              👁️ باقات المشاهدات والتفاعل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BUNDLES.filter(b => b.category === 'views').map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} formatPrice={formatPrice} onSelect={setSelectedBundle} />
              ))}
            </div>
          </div>

          {/* Order Modal */}
          {selectedBundle && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <div className="bg-[var(--bg-card)] rounded-[32px] p-8 max-w-[450px] w-full border border-[var(--border-color)] shadow-2xl relative">
                <button onClick={() => setSelectedBundle(null)} className="absolute top-6 left-6 text-[var(--text-tertiary)] hover:text-white transition-all text-[1.2rem]">✕</button>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedBundle.color} flex items-center justify-center text-[2rem] mb-6 shadow-lg`}>
                  {selectedBundle.emoji}
                </div>

                <h3 className="text-[1.3rem] font-black text-[var(--text-primary)] mb-2">{selectedBundle.name}</h3>
                <p className="text-[0.9rem] text-[var(--text-secondary)] font-bold mb-6">المطلوب لإتمام الطلب:</p>

                <form onSubmit={handleOrderSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[0.8rem] font-black text-[var(--text-tertiary)] mb-2 mr-1">
                      {selectedBundle.requires === 'username' ? 'اسم المستخدم (بدون @)' : 'رابط المنشور أو القناة'}
                    </label>
                    <input 
                      type="text" 
                      required 
                      className="input-field h-[55px] rounded-[16px] bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--brand-primary)] outline-none px-5 font-bold text-[0.95rem] w-full transition-all"
                      placeholder={selectedBundle.requires === 'username' ? 'مثال: tafaulkom' : 'https://...'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>

                  {message.text && (
                    <div className={`p-4 rounded-xl text-[0.85rem] font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {message.text}
                    </div>
                  )}

                  <button 
                    disabled={ordering}
                    className="w-full py-5 rounded-[18px] bg-[var(--brand-primary)] text-white font-black text-[1rem] hover:brightness-110 shadow-xl shadow-purple-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {ordering ? 'جاري تنفيذ طلبك...' : `تأكيد الطلب (${formatPrice(selectedBundle.price)})`}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

function BundleCard({ bundle, formatPrice, onSelect }: { bundle: Bundle, formatPrice: (p: number) => string, onSelect: (b: Bundle) => void }) {
  return (
    <div className="card rounded-[32px] overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] hover:scale-[1.03] transition-all duration-300 shadow-xl relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${bundle.color} opacity-0 group-hover:opacity-[0.03] transition-all`}></div>
      <div className={`h-28 bg-gradient-to-l ${bundle.color} flex items-center justify-between px-8`}>
        <div className="text-white">
          <p className="text-[0.75rem] font-black opacity-80 uppercase tracking-widest">{bundle.platform}</p>
          <h3 className="text-[1.2rem] font-black">{bundle.emoji} {bundle.name}</h3>
        </div>
        <img src={bundle.icon} width={50} height={50} className="filter drop-shadow-lg" alt={bundle.platform} />
      </div>
      <div className="p-8">
         <div className="space-y-4 mb-8">
             {bundle.items.map((item, i) => (
               <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]/30">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[0.75rem] font-black flex-shrink-0">✓</div>
                   <p className="text-[0.9rem] font-bold text-[var(--text-primary)]">{item.name}</p>
                 </div>
                 <span className="text-[0.65rem] font-black px-2 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-lg">{(item as any).qty || 'تم'}</span>
               </div>
             ))}
         </div>
         <div className="flex items-end gap-3 mb-8">
           <span className="text-[2.2rem] font-black text-[var(--text-primary)] leading-none" dir="ltr">{formatPrice(bundle.price)}</span>
           <span className="text-[1rem] font-bold text-[var(--text-tertiary)] line-through mb-1" dir="ltr">{formatPrice(bundle.originalPrice)}</span>
         </div>
         <button 
           onClick={() => onSelect(bundle)}
           className="w-full py-4 rounded-[20px] bg-[var(--brand-primary)] text-white font-black text-[0.95rem] hover:shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
         >
           🛒 اشترك الآن
         </button>
      </div>
    </div>
  )
}
