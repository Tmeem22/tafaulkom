"use client";
import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CURRENCY_SYMBOL } from '@/lib/constants';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png', active: true },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png' },
];

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("حجم الصورة يجب أن يكون أقل من 5 ميجابايت", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !image) {
      showToast("الرجاء إدخال المبلغ وإرفاق صورة الإيصال", "error");
      return;
    }

    if (Number(amount) < 5) {
      showToast("أقل مبلغ للايداع هو 5 ر.س", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'Bank Transfer',
          amount: amount,
          receiptImage: image
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setAmount('');
        setImage(null);
        showToast("تم إرسال طلب الشحن بنجاح", "success");
      } else {
        showToast("حدث خطأ أثناء الإرسال", "error");
      }
    } catch (error) {
      showToast("فشل الاتصال بالخادم", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [hasSupportUnread, setHasSupportUnread] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
       try {
          const res = await fetch('/api/tickets');
          const data = await res.json();
          if (data.tickets) {
             const unread = data.tickets.some((t: any) => t.status === 'open' && t.messages?.[0]?.isAdmin);
             setHasSupportUnread(unread);
          }
       } catch (e) {}
    };
    checkSupport();
  }, []);

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px]">
        {/* Sidebar */}
        <aside className="w-[250px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 flex flex-col gap-1 fixed top-[70px] bottom-0 overflow-y-auto hidden md:flex transition-all">
          <div className="p-4 bg-[var(--gradient-primary)] rounded-[var(--radius-lg)] mb-4 text-center shadow-lg shadow-purple-500/20">
            <p className="text-white/80 text-[0.75rem] font-bold uppercase tracking-wider mb-1">الرصيد الحالي</p>
            <p className="text-white text-[1.8rem] font-black tracking-tight" dir="ltr">0.00 {CURRENCY_SYMBOL}</p>
          </div>
          {sideLinks.map((l, i) => (
            <Link 
              key={i} 
              href={l.href} 
              className={`p-3 rounded-[var(--radius-md)] no-underline flex items-center justify-between gap-3 text-[0.9rem] font-bold transition-all ${
                l.active 
                  ? 'bg-[var(--bg-secondary)] text-[var(--brand-primary)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={l.icon} alt={l.label} width={20} height={20} className={l.active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} /> 
                {l.label}
              </div>
              {l.href === '/dashboard/support' && hasSupportUnread && (
                 <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              )}
            </Link>
          ))}
          <div className="mt-auto py-4 border-t border-[var(--border-color)]">
            <Link href="/" className="p-3 rounded-[var(--radius-md)] no-underline flex items-center gap-3 text-[0.85rem] font-bold text-[var(--brand-danger)] hover:bg-red-500/5 transition-all">
              <img src="https://img.icons8.com/fluency/256/exit.png" width={20} height={20} alt="خروج" /> تسجيل الخروج
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:mr-[250px] p-6 md:p-12 transition-all">
          <div className="max-w-[900px] mx-auto">
            <div className="mb-8">
              <h1 className="text-[1.8rem] font-black text-[var(--text-primary)] mb-2 flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/card-exchange.png" width={32} height={32} alt="أيقونة الشحن" /> إضافة رصيد
              </h1>
              <p className="text-[var(--text-secondary)] text-[0.9rem]">فضلاً قم بتحويل المبلغ على الحسابات المتوفرة ثم أرفق إيصال الدفع (أقل مبلغ 5 ر.س)</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="card p-6 border-2 border-[var(--brand-primary)] animate-fade-in relative overflow-hidden bg-gradient-to-br from-[var(--bg-card)] to-[var(--brand-primary)]/5">
                <h3 className="text-[1.1rem] font-black text-[var(--brand-primary)] mb-4 flex items-center gap-2">
                   <img src="https://img.icons8.com/fluency/256/info.png" alt="Info icon" width={20} /> تفاصيل التحويل البنكي
                </h3>
                <div className="space-y-3 text-[0.9rem] font-bold text-[var(--text-secondary)]">
                   <p><span className="text-[var(--text-tertiary)] ml-2">اسم المستفيد:</span> مؤسسة تسويق فيرال</p>
                   <p><span className="text-[var(--text-tertiary)] ml-2">الآيبان:</span> <span className="font-mono text-[var(--text-primary)] tracking-wider">SA2080000523608016083089</span></p>
                   <p className="text-[0.75rem] text-red-500 font-bold mt-4">⚠️ أقل مبلغ للشحن هو 5 ر.س. لضمان قبول الطلب فوراً.</p>
                </div>
              </div>

              <div className="card p-8 shadow-xl">
                {showSuccess ? (
                  <div className="text-center p-8 space-y-6">
                    <img src="https://img.icons8.com/fluency/256/checkmark.png" alt="Success checkmark" width={48} className="mx-auto" />
                    <h2 className="text-xl font-bold">تم الإرسال بنجاح</h2>
                    <button className="btn-secondary px-8 py-2" onClick={() => setShowSuccess(false)}>إرسال طلب آخر</button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[1.1rem] font-bold mb-4">1. مبلغ الحوالة المودع (بـ {CURRENCY_SYMBOL})</h2>
                    <input 
                      type="number" 
                      className="input-field !text-center !text-xl" 
                      placeholder="0.00" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                    />
                    <div className="flex gap-2 flex-wrap mt-4 mb-8">
                      {quickAmounts.map(qa => (
                        <button key={qa} onClick={() => setAmount(qa.toString())} className="px-4 py-2 rounded-full border border-[var(--border-color)]">
                          {qa} {CURRENCY_SYMBOL}
                        </button>
                      ))}
                    </div>

                    <h2 className="text-[1.1rem] font-bold mb-4">2. إرفاق إيصال التحويل</h2>
                    <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-[var(--border-color)] rounded-xl cursor-pointer mb-8">
                      {image ? <img src={image} alt="Uploaded receipt preview" className="max-h-[150px] rounded-lg" /> : <span>اضغط لرفع الإيصال</span>}
                      <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>

                    <button className="btn-primary w-full py-4 text-lg font-bold" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب الشحن'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
