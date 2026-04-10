"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useCurrency } from '@/components/CurrencyProvider';

// Prices are in USD. (1 USD = 3.75 SAR). 
// The discounts are structured to give a 5-15 SAR savings (1.33 to 4.00 USD).
const BUNDLES = [
  {
    id: 'insta-starter',
    name: 'باقة انطلاقة انستقرام',
    platform: 'Instagram',
    icon: 'https://img.icons8.com/color/96/instagram-new.png',
    color: 'from-pink-500 to-purple-600',
    originalPrice: 7.99, // ~29.96 SAR
    price: 6.66, // ~24.97 SAR (Saving ~5 SAR)
    items: [
      { name: '1,000 متابع حقيقي', qty: '1K' },
      { name: '500 لايك على آخر صورة', qty: '500' },
      { name: '50 تعليق عربي', qty: '50' },
    ],
    popular: true,
    emoji: '📸'
  },
  {
    id: 'tiktok-star',
    name: 'باقة نجم تيك توك',
    platform: 'TikTok',
    icon: 'https://img.icons8.com/color/96/tiktok.png',
    color: 'from-[#fe2c55] to-[#25f4ee]',
    originalPrice: 12.00, // ~45.00 SAR
    price: 9.33,  // ~34.98 SAR (Saving ~10 SAR)
    items: [
      { name: '5,000 متابع', qty: '5K' },
      { name: '2,000 لايك', qty: '2K' },
      { name: '1,000 مشاهدة', qty: '1K' },
    ],
    popular: false,
    emoji: '🎵'
  },
  {
    id: 'youtube-creator',
    name: 'باقة يوتيوبر',
    platform: 'YouTube',
    icon: 'https://img.icons8.com/color/96/youtube-play.png',
    color: 'from-red-500 to-red-700',
    originalPrice: 18.00, // ~67.50 SAR
    price: 15.33, // ~57.48 SAR (Saving ~10 SAR)
    items: [
      { name: '1,000 مشترك', qty: '1K' },
      { name: '5,000 مشاهدة', qty: '5K' },
      { name: '200 لايك', qty: '200' },
    ],
    popular: false,
    emoji: '🎬'
  },
  {
    id: 'twitter-boost',
    name: 'باقة تعزيز تويتر',
    platform: 'Twitter / X',
    icon: 'https://img.icons8.com/color/96/twitter.png',
    color: 'from-blue-400 to-blue-600',
    originalPrice: 8.50, // ~31.87 SAR
    price: 7.16, // ~26.85 SAR (Saving ~5 SAR)
    items: [
      { name: '1,000 متابع', qty: '1K' },
      { name: '500 لايك', qty: '500' },
      { name: '300 ريتويت', qty: '300' },
    ],
    popular: false,
    emoji: '🐦'
  },
  {
    id: 'snap-popular',
    name: 'باقة سناب المشهور',
    platform: 'Snapchat',
    icon: 'https://img.icons8.com/color/96/snapchat.png',
    color: 'from-yellow-400 to-yellow-500',
    originalPrice: 15.00, // ~56.25 SAR
    price: 13.00, // ~48.75 SAR (Saving ~7.5 SAR)
    items: [
      { name: '2,000 متابع', qty: '2K' },
      { name: '1,000 مشاهدة قصة', qty: '1K' },
      { name: '500 نقاط سناب', qty: '500' },
    ],
    popular: false,
    emoji: '👻'
  },
  {
    id: 'mega-influencer',
    name: 'باقة المؤثر الخارق',
    platform: 'Multi-Platform',
    icon: 'https://img.icons8.com/fluency/256/social-media.png',
    color: 'from-purple-600 via-pink-500 to-amber-500',
    originalPrice: 35.00, // 131.25 SAR
    price: 31.00, // 116.25 SAR (Saving ~15 SAR)
    items: [
      { name: '5K متابع انستقرام', qty: '5K' },
      { name: '3K متابع تيك توك', qty: '3K' },
      { name: '1K مشترك يوتيوب', qty: '1K' },
      { name: '2K لايك شامل', qty: '2K' },
    ],
    popular: true,
    emoji: '👑'
  },
];

export default function BundlesPage() {
  const [cart, setCart] = useState<typeof BUNDLES>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const { formatPrice } = useCurrency();

  const addToCart = (bundle: typeof BUNDLES[0]) => {
    if (cart.find(b => b.id === bundle.id)) {
      showToast('هذه الباقة موجودة في السلة بالفعل!', 'error');
      return;
    }
    setCart(prev => [...prev, bundle]);
    showToast(`✅ تمت إضافة "${bundle.name}" للسلة!`, 'success');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(b => b.id !== id));
  };

  const totalPrice = cart.reduce((sum, b) => sum + b.price, 0);
  const totalOriginal = cart.reduce((sum, b) => sum + b.originalPrice, 0);
  const cartDiscount = totalOriginal - totalPrice;

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setOrdering(true);
    // In a real implementation, this would send the bundle order to API
    // For now, redirect to dashboard with a message
    showToast('🚀 للطلب، استخدم صفحة "طلب جديد" واختر الخدمات المطلوبة. الباقات قريباً ستدعم الطلب المباشر!', 'success');
    setOrdering(false);
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen pt-[90px] bg-[var(--bg-secondary)]">
        <div className="max-w-[1280px] mx-auto px-6 py-12">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block py-2 px-5 rounded-full bg-amber-500/10 text-amber-500 font-black text-[0.85rem] mb-4 border border-amber-500/20">
              🏷️ وفّر حتى 40%
            </span>
            <h1 className="text-[2.5rem] md:text-[3.5rem] font-black text-[var(--text-primary)] mb-4 leading-tight">
              باقات جاهزة <span className="text-gradient">بأسعار خرافية</span>
            </h1>
            <p className="text-[1.1rem] text-[var(--text-secondary)] font-medium max-w-[600px] mx-auto">
              حلول متكاملة لنمو حساباتك. اختر الباقة المناسبة وانطلق!
            </p>
          </div>

          {/* Bundles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BUNDLES.map((bundle, i) => (
              <div key={i} className={`card rounded-[28px] overflow-hidden border-2 ${bundle.popular ? 'border-amber-500/40 shadow-lg shadow-amber-500/10' : 'border-[var(--border-color)]'} bg-[var(--bg-card)] group hover:scale-[1.02] transition-all duration-300 relative`}>
                {bundle.popular && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white text-[0.7rem] font-black py-1 px-3 rounded-full z-10 animate-pulse">🔥 الأكثر مبيعاً</div>
                )}

                {/* Banner */}
                <div className={`bg-gradient-to-l ${bundle.color} p-6 flex items-center justify-between`}>
                  <div>
                    <p className="text-white/80 font-bold text-[0.8rem]">{bundle.platform}</p>
                    <h3 className="text-white font-black text-[1.2rem]">{bundle.emoji} {bundle.name}</h3>
                  </div>
                  <img src={bundle.icon} width={48} height={48} alt={bundle.platform} className="opacity-80" />
                </div>

                {/* Items */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {bundle.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[0.7rem] font-black flex-shrink-0">✓</span>
                        <p className="text-[0.85rem] font-bold text-[var(--text-primary)]">{item.name}</p>
                        <span className="mr-auto text-[0.7rem] font-black text-[var(--text-tertiary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full">{item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-3 mb-5">
                    <p className="text-[2rem] font-black text-[var(--text-primary)]" dir="ltr">{formatPrice(bundle.price)}</p>
                    <p className="text-[1rem] font-bold text-[var(--text-tertiary)] line-through" dir="ltr">{formatPrice(bundle.originalPrice)}</p>
                    <span className="bg-red-500/10 text-red-500 text-[0.7rem] font-black py-1 px-2 rounded-full">
                      توفير {formatPrice(bundle.originalPrice - bundle.price)}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCart(bundle)}
                    disabled={!!cart.find(b => b.id === bundle.id)}
                    className={`w-full py-4 rounded-2xl font-black text-[0.95rem] transition-all flex items-center justify-center gap-2 ${
                      cart.find(b => b.id === bundle.id)
                        ? 'bg-emerald-500/10 text-emerald-500 cursor-default'
                        : 'bg-[var(--brand-primary)] text-white hover:brightness-110 shadow-lg shadow-purple-500/20 active:scale-95'
                    }`}
                  >
                    {cart.find(b => b.id === bundle.id) ? '✅ في السلة' : '🛒 أضف للسلة'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Cart Button */}
          {cart.length > 0 && (
            <button
              onClick={() => setShowCart(!showCart)}
              className="fixed bottom-6 left-6 z-50 bg-[var(--brand-primary)] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-purple-500/30 font-black flex items-center gap-3 hover:scale-105 transition-all"
            >
              🛒 السلة ({cart.length})
              <span className="bg-white/20 px-3 py-1 rounded-xl text-[0.9rem]" dir="ltr">{formatPrice(totalPrice)}</span>
            </button>
          )}

          {/* Cart Modal */}
          {showCart && cart.length > 0 && (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)}>
              <div className="bg-[var(--bg-card)] rounded-[28px] p-6 md:p-8 max-w-[500px] w-full border border-[var(--border-color)] shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-[1.3rem] font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
                  🛒 سلة المشتريات ({cart.length} باقة)
                </h2>

                <div className="space-y-3 mb-6">
                  {cart.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={b.icon} width={28} height={28} alt={b.platform} />
                        <div>
                          <p className="font-black text-[0.85rem] text-[var(--text-primary)]">{b.name}</p>
                          <p className="text-[0.7rem] text-[var(--text-tertiary)]">{b.items.length} خدمات</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-emerald-500" dir="ltr">{formatPrice(b.price)}</p>
                        <button onClick={() => removeFromCart(b.id)} className="w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-[0.7rem] font-black hover:bg-red-500 hover:text-white transition-all">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-[0.85rem]">
                    <span className="text-[var(--text-secondary)] font-bold">السعر الأصلي</span>
                    <span className="text-[var(--text-tertiary)] line-through" dir="ltr">{formatPrice(totalOriginal)}</span>
                  </div>
                  <div className="flex justify-between text-[0.85rem]">
                    <span className="text-emerald-500 font-bold">توفير حقيقي</span>
                    <span className="text-emerald-500 font-black" dir="ltr">-{formatPrice(cartDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-[1.1rem] font-black border-t border-[var(--border-color)] pt-2">
                    <span className="text-[var(--text-primary)]">الإجمالي</span>
                    <span className="text-[var(--brand-primary)]" dir="ltr">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="w-full py-4 bg-[var(--brand-primary)] text-white font-black rounded-2xl hover:brightness-110 no-underline flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  🚀 اطلب من صفحة الخدمات
                </Link>

                <button onClick={() => setShowCart(false)} className="w-full mt-3 py-2 text-[var(--text-tertiary)] font-bold text-[0.85rem]">
                  متابعة التصفح
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
