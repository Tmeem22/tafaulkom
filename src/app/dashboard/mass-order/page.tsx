"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';
import { useCurrency } from '@/components/CurrencyProvider';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'الطلب الجماعي', href: '/dashboard/mass-order', icon: 'https://img.icons8.com/fluency/256/add-list.png', active: true },
  { label: 'سلة المشتريات', href: '/dashboard/cart', icon: 'https://img.icons8.com/color/96/shopping-basket.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'الربط البرمجي (API)', href: '/dashboard/api-docs', icon: 'https://img.icons8.com/fluency/256/api.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
];

export default function MassOrderPage() {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  
  const parseOrders = () => {
    if (!inputText.trim()) return [];
    
    const lines = inputText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const parsed = [];
    
    for (const line of lines) {
      const parts = line.split('|');
      if (parts.length === 3) {
        parsed.push({
          serviceId: parts[0].trim(),
          link: parts[1].trim(),
          quantity: parts[2].trim()
        });
      }
    }
    return parsed;
  };

  const lineCount = inputText.split('\n').filter(l => l.trim().length > 0).length;
  const parsedCount = parseOrders().length;

  const handleSubmit = async () => {
    const orders = parseOrders();
    if (orders.length === 0) {
      showToast('الرجاء التأكد من كتابة الطلبات بالصيغة الصحيحة', 'error');
      return;
    }
    if (orders.length > 50) {
      showToast('الحد الأقصى هو 50 طلب في المرة الواحدة', 'error');
      return;
    }

    if (!confirm(`هل أنت متأكد من رغبتك في إرسال ${orders.length} طلبات دفعة واحدة؟`)) return;

    setIsSubmitting(true);
    setResultMsg('جاري المُعالجة والحجز... يرجى عدم إغلاق الصفحة');

    try {
      const res = await fetch('/api/orders/mass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast(data.message, 'success');
        setResultMsg('');
        setInputText('');
      } else {
        showToast(data.error || 'حدث خطأ أثناء الإرسال', 'error');
        setResultMsg('');
      }
    } catch {
      showToast('تأكد من اتصالك بالإنترنت', 'error');
      setResultMsg('');
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
          <div className="max-w-[900px] mx-auto animate-fade-in-up">
            
            <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] mb-2 flex items-center gap-4">
               <img src="https://img.icons8.com/fluency/256/add-list.png" width={44} height={44} alt="Mass Order" /> 
               الطلب الجماعي
            </h1>
            <p className="text-[0.95rem] text-[var(--text-secondary)] font-bold mb-8">هل أنت موزع؟ نفذ آلاف الطلبات لعملائك بضغطة زر واحدة والتسليم فوري.</p>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
              
              {/* Form Input */}
              <div className="card p-6 lg:p-8 rounded-[30px] border border-[var(--border-color)] shadow-sm flex flex-col h-full">
                 <div className="mb-4 flex justify-between items-end">
                    <label className="font-black text-[1.1rem]">أدخل طلباتك هنا:</label>
                    <span className="text-[0.8rem] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-3 py-1 rounded-full">
                       صيغة الإدخال
                    </span>
                 </div>
                 
                 <div className="bg-[#111] p-4 rounded-[20px] mb-6 border border-[#222]">
                    <code className="text-emerald-400 font-mono text-[0.8rem] md:text-[0.9rem] block mb-2" dir="ltr">
                        service_id | link | quantity
                    </code>
                    <p className="text-gray-400 text-[0.8rem] mt-2">مثال:</p>
                    <code className="text-gray-300 font-mono text-[0.75rem] md:text-[0.85rem] block opacity-80" dir="ltr">
                        402 | https://tiktok.com/@user1 | 500<br/>
                        105 | https://instagram.com/p/123 | 1000
                    </code>
                 </div>

                 <textarea 
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[20px] p-6 text-[0.9rem] font-mono leading-relaxed min-h-[300px] outline-none focus:border-[var(--brand-primary)] transition-all resize-y text-left"
                    dir="ltr"
                    placeholder="25 | https://example.com/post1 | 5000&#10;89 | https://example.com/post2 | 10000"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                 />

                 <div className="mt-6">
                    {resultMsg && <p className="text-amber-500 font-black text-center mb-4 animate-pulse">{resultMsg}</p>}
                    
                    <button 
                       onClick={handleSubmit}
                       disabled={isSubmitting || parsedCount === 0}
                       className="w-full btn-primary py-5 rounded-[20px] font-black text-[1.1rem] shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-3"
                    >
                        {isSubmitting ? 'جاري المعالجة والاتصال بالمزود...' : '🚀 تنفيذ ' + parsedCount + ' طلب الآن'}
                    </button>
                    {lineCount > 0 && lineCount !== parsedCount && (
                        <p className="text-red-500 font-bold text-center text-[0.85rem] mt-4">
                           هناك أسطر مكتوبة بصيغة خاطئة (سيتم تجاهلها)
                        </p>
                    )}
                 </div>
              </div>

              {/* Tips / Rules */}
              <div className="flex flex-col gap-4">
                 <div className="card p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20">
                     <h3 className="font-black text-blue-500 mb-4 flex items-center gap-2">
                        <img src="https://img.icons8.com/fluency/256/info.png" width={20} alt="info" /> القواعد
                     </h3>
                     <ul className="text-[0.85rem] text-[var(--text-secondary)] space-y-3 font-medium leading-relaxed">
                        <li>• تأكد من وضع الإشارة <strong className="text-[var(--text-primary)]">|</strong> بين كل حقل بدون أقواس.</li>
                        <li>• يرجى إدخال <strong className="text-[var(--text-primary)]">ID الخدمة</strong> بشكل صحيح (تجده في صفحة الخدمات).</li>
                        <li>• أقصى عدد في الضغطة الواحدة هو <strong className="text-[var(--text-primary)]">50 طلباً</strong> لحماية النظام وتجنب التعليق.</li>
                     </ul>
                 </div>
                 
                 <div className="card p-6 rounded-3xl bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20">
                     <h3 className="font-black text-[var(--brand-primary)] mb-3">آلية الخصم</h3>
                     <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed">
                        النظام سيقوم بحساب إجمالي الطلبات الصحيحة وتسعيرها وخصمها من رصيدك بضغطة واحدة.
                     </p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
