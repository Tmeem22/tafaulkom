"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { showToast } from '@/hooks/useNotification';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'سلة المشتريات', href: '/dashboard/cart', icon: 'https://img.icons8.com/color/96/shopping-basket.png', active: true },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png' },
  { label: 'تقاريري', href: '/dashboard/analytics', icon: 'https://img.icons8.com/fluency/256/combo-chart.png' },
];

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smm_cart');
    if (saved) setCart(JSON.parse(saved));
    setLoading(false);
  }, []);

  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem('smm_cart', JSON.stringify(newCart));
    // Trigger storage event for navbar counter
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.cost), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    let successCount = 0;

    for (const item of cart) {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: item.serviceId,
            link: item.link,
            quantity: item.quantity
          })
        });

        if (res.ok) {
          successCount++;
        } else {
          const err = await res.json();
          showToast(`خطأ في طلب ${item.serviceName}: ${err.error}`, 'error');
        }
      } catch (error) {
        showToast(`فشل الاتصال لخدمة ${item.serviceName}`, 'error');
      }
    }

    if (successCount > 0) {
      showToast(`تم تنفيذ ${successCount} طلبات بنجاح من أصل ${cart.length} 🚀`, 'success');
      if (successCount === cart.length) {
        clearCart();
      } else {
        localStorage.removeItem('smm_cart');
        setCart([]);
        window.dispatchEvent(new Event('storage'));
      }
    }
    setSubmitting(false);
  };

  if (loading) return null;

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        <aside className="w-[250px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 fixed top-[70px] bottom-0 overflow-y-auto hidden md:flex flex-col gap-1">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-3 rounded-xl no-underline flex items-center gap-3 text-[0.9rem] font-bold transition-all ${l.active ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} width={22} height={22} alt={l.label} /> {l.label}
            </Link>
          ))}
        </aside>

        <div className="flex-1 md:mr-[250px] p-4 md:p-10">
          <div className="max-w-[900px] mx-auto">
            <h1 className="text-[2rem] font-black text-[var(--text-primary)] mb-8 flex items-center gap-3">
              <img src="https://img.icons8.com/color/96/shopping-basket.png" width={40} height={40} alt="Basket" />
              سلة المشتريات ({cart.length})
            </h1>

            {cart.length === 0 ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[24px] p-12 text-center shadow-sm">
                <img src="https://img.icons8.com/color/96/shopping-basket.png" className="w-[80px] h-[80px] mx-auto mb-4 opacity-50 grayscale" alt="Empty" />
                <h3 className="text-[1.5rem] font-black text-[var(--text-primary)] mb-2">السلة فارغة حالياً</h3>
                <p className="text-[var(--text-secondary)] mb-6">اذهب إلى صفحة الطلب وابدأ بإضافة الخدمات إلى سلتك.</p>
                <Link href="/dashboard" className="px-6 py-3 bg-[var(--brand-primary)] text-white font-bold rounded-xl no-underline inline-block hover:brightness-110 transition-all">
                  تصفح الخدمات
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map((item, i) => (
                    <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-[16px] flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-[0.9rem] text-[var(--text-primary)] mb-1">{item.serviceName}</p>
                        <p className="text-[0.8rem] text-[var(--text-secondary)]" dir="ltr">{item.link}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-[var(--bg-secondary)] px-4 py-2 rounded-xl">
                        <span className="text-[0.8rem] text-[var(--text-tertiary)]">الكمية</span>
                        <span className="font-black text-[var(--text-primary)]" dir="ltr">{item.quantity}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <span className="text-[1.1rem] font-black text-[var(--brand-primary)]" dir="ltr">{item.cost} {CURRENCY_SYMBOL}</span>
                      </div>
                      <button onClick={() => removeItem(i)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex flex-shrink-0 items-center justify-center transition-all" title="إزالة">
                        ×
                      </button>
                    </div>
                  ))}
                  <button onClick={clearCart} className="text-red-500 text-[0.85rem] font-bold hover:underline">
                    🗑️ إفراغ السلة
                  </button>
                </div>

                {/* Summary Panel */}
                <div>
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-[24px] sticky top-[100px]">
                    <h3 className="font-black text-[1.2rem] mb-4 border-b border-[var(--border-color)] pb-4">ملخص السلة</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-[0.9rem]">
                        <span className="text-[var(--text-secondary)]">عدد الخدمات</span>
                        <span className="font-bold">{cart.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-[0.9rem]">
                        <span className="text-[var(--text-secondary)]">إجمالي الكميات</span>
                        <span className="font-bold" dir="ltr">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[var(--text-secondary)]">الإجمالي</span>
                        <span className="font-black text-[1.5rem] text-[var(--brand-primary)]" dir="ltr">{total.toFixed(4)} {CURRENCY_SYMBOL}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      disabled={submitting}
                      className="w-full bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-accent)] text-white font-black py-4 text-[1.1rem] rounded-2xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      {submitting ? 'جاري الطلب...' : '🛒 تأكيد الدفع لجميع الخدمات'}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
