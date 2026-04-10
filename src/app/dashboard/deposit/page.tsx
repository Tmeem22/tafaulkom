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
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'API', href: '/api-docs', icon: 'https://img.icons8.com/fluency/256/code.png' },
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
              <p className="text-[var(--text-secondary)] text-[0.9rem]">فضلاً قم بتحويل المبلغ على الحسابات المتوفرة ثم أرفق إيصال الدفع</p>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Bank Details Warning */}
              <div className="card p-6 border-2 border-[var(--brand-primary)] animate-fade-in relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--brand-primary)]/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                <h3 className="text-[1rem] font-bold text-[var(--brand-primary)] mb-3 relative flex items-center gap-2">
                   <img src="https://img.icons8.com/fluency/256/info.png" width={18} height={18} alt="معلومات" /> معلومات التحويل
                </h3>
                <p className="text-[var(--text-secondary)] text-[0.85rem] leading-[1.8] relative">
                  الرجاء تحويل المبلغ إلى الحساب البنكي التالي:<br/><br/>
                  <strong>اسم المستفيد:</strong> مؤسسة تسويق فيرال<br/>
                  <strong>رقم الحساب:</strong> 12345678901234<br/>
                  <strong>الآيبان:</strong> SA1234000000123456789012<br/><br/>
                  بعد التحويل، قم بتحديد المبلغ المودع وإرفاق صورة واضحة ومقروءة لإيصال التحويل، وستتم مراجعة طلبك وإضافة الرصيد في أقرب وقت.
                </p>
              </div>

              {/* Deposit Form */}
              <div className="card p-8 shadow-xl">
                {showSuccess ? (
                  <div className="text-center p-8 space-y-6 animate-fade-in-up">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto shadow-inner">
                      <img src="https://img.icons8.com/fluency/256/checkmark.png" width={48} height={48} alt="نجاح" />
                    </div>
                    <div>
                      <h2 className="text-[1.5rem] font-black text-[var(--text-primary)] mb-3">تم إرسال طلب الشحن بنجاح</h2>
                      <p className="text-[var(--text-secondary)] max-w-md mx-auto">تتم الآن مراجعة إيصالك من قبل الإدارة، سيتم إضافة الرصيد لحسابك فور التحقق منه.</p>
                    </div>
                    <button className="btn-secondary !px-10 !py-3 !rounded-full !font-bold" onClick={() => setShowSuccess(false)}>إرسال طلب آخر</button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[1.1rem] font-bold text-[var(--text-primary)] mb-4">1. مبلغ الحوالة المودع (بـ {CURRENCY_SYMBOL})</h2>
                    <div className="relative mb-4">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[1.2rem] font-black text-[var(--brand-primary)]">{CURRENCY_SYMBOL}</span>
                      <input 
                        type="number" 
                        className="input-field !pl-10 !text-[1.3rem] !font-black !text-center" 
                        placeholder="0.00" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        aria-label="مبلغ الإيداع"
                        dir="ltr" 
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap mb-8">
                      {quickAmounts.map(qa => (
                        <button 
                          key={qa} 
                          onClick={() => setAmount(qa.toString())} 
                          className={`px-4 py-2 rounded-full border-2 font-bold text-[0.85rem] transition-all duration-300 ${
                            amount === qa.toString() 
                              ? 'bg-[var(--gradient-cta)] border-transparent text-white shadow-lg shadow-purple-500/20' 
                              : 'bg-transparent border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]'
                          }`}
                        >
                          {qa} {CURRENCY_SYMBOL}
                        </button>
                      ))}
                    </div>

                    <h2 className="text-[1.1rem] font-bold text-[var(--text-primary)] mb-4">2. إرفاق إيصال التحويل</h2>
                    <div className="group">
                      <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-[var(--border-color)] rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] cursor-pointer mb-8 transition-all duration-300 group-hover:border-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)]/5">
                        {image ? (
                          <div className="text-center animate-fade-in">
                            <img src={image} alt="Receipt Preview" className="max-h-[180px] rounded-[var(--radius-md)] mb-4 shadow-lg ring-4 ring-white" />
                            <p className="text-[0.85rem] font-bold text-[var(--brand-primary)]">تم إرفاق الصورة، اضغط لتغييرها</p>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                               <img src="https://img.icons8.com/fluency/256/camera.png" width={40} height={40} alt="كاميرا" />
                            </div>
                            <div>
                               <span className="text-[1rem] font-bold text-[var(--text-primary)] block mb-1">اسحب وأفلت صورة الإيصال أو اضغط للاختيار</span>
                               <span className="text-[0.75rem] text-[var(--text-tertiary)] uppercase tracking-wide">الصيغ المدعومة: JPG, PNG, WEBP (بحد أقصى 5MB)</span>
                            </div>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>

                    <button 
                      className="btn-primary w-full !py-4 !text-[1.1rem] !rounded-[var(--radius-lg)] !font-black flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform shadow-lg shadow-purple-500/20" 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <img src="https://img.icons8.com/fluency/256/hourglass.png" width={24} height={24} className="animate-spin brightness-0 invert" alt="جاري التحميل" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <img src="https://img.icons8.com/fluency/256/cloud-upload.png" width={24} height={24} className="brightness-0 invert" alt="رفع" />
                          إرسال طلب الشحن
                        </>
                      )}
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
