"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/deposits');
      const data = await res.json();
      if (data.deposits) {
        setDeposits(data.deposits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    if (action === 'reject') {
        const reason = window.prompt("سبب الرفض (اختياري):");
        if (reason === null) return;
    }
    
    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        showToast("تم تحديث حالة الطلب بنجاح", "success");
        fetchDeposits();
      } else {
        showToast("حدث خطأ أثناء التحديث", "error");
      }
    } catch (error) {
      showToast("فشل الاتصال بالخادم", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
        <img src="https://img.icons8.com/fluency/256/hourglass.png" width={48} height={48} className="animate-spin mb-4" alt="تحميل" />
        <p className="font-bold">جاري تحميل طلبات الإيداع...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] flex items-center gap-4">
            <img src="https://img.icons8.com/fluency/256/money.png" width={45} height={45} alt="أيقونة الأموال" /> الإيداعات المالية
          </h1>
          <p className="text-[var(--text-secondary)] font-medium">مراجعة والتحقق من عمليات شحن الرصيد يدوياً.</p>
        </div>
        <div className="bg-[var(--bg-card)] p-4 px-6 rounded-[20px] border border-[var(--border-color)] text-center shadow-sm">
            <span className="block text-[0.7rem] text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wider">طلبات معلقة</span>
            <span className="text-xl font-black text-[var(--brand-accent)]">{deposits.filter(d => d.status === 'pending').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {deposits.length === 0 ? (
          <div className="card p-20 text-center flex flex-col items-center gap-6">
            <img src="https://img.icons8.com/article/128/mailbox-closed-flag-down.png" width={80} height={80} className="opacity-20" alt="لا توجد طلبات" />
            <h3 className="text-[1.2rem] font-bold text-[var(--text-tertiary)]">لا توجد طلبات إيداع مسجلة</h3>
          </div>
        ) : (
          deposits.map(d => (
            <div key={d.id} className="card group p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-8 items-center hover:border-[var(--brand-primary)]/40 transition-all">
              
              {/* Receipt Image Preview */}
              <div 
                className="relative w-full lg:w-[160px] h-[160px] rounded-[22px] bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center border border-[var(--border-color)] cursor-zoom-in group/img shadow-inner"
                onClick={() => setViewingReceipt(d.receiptImage)}
              >
                <img src={d.receiptImage} alt={`إيصال رقم ${d.id}`} className="max-w-full max-h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <img src="https://img.icons8.com/fluency/256/search.png" width={32} height={32} alt="view" />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-[1.3rem] font-black text-[var(--text-primary)]">طلب شحن #{d.id}</h3>
                    <span className={`px-4 py-1.5 rounded-full text-[0.7rem] font-black flex items-center gap-2 ${
                        d.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        d.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-red-500/10 text-red-500'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'pending' ? 'bg-amber-500 animate-pulse' : d.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {d.status === 'pending' ? 'قيد المراجعة' : d.status === 'completed' ? 'تمت الموافقة' : 'مرفوض'}
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[0.7rem] font-bold text-[var(--text-tertiary)] uppercase">قيمة الإيداع</span>
                        <span className="text-[1.3rem] font-black text-[var(--brand-primary)]" dir="ltr">{d.amount.toFixed(2)} {CURRENCY_SYMBOL}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[0.7rem] font-bold text-[var(--text-tertiary)] uppercase">اسم المستخدم</span>
                        <span className="text-[0.95rem] font-bold text-[var(--text-primary)]">{d.user?.username || 'ضيف'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[0.7rem] font-bold text-[var(--text-tertiary)] uppercase">تاريخ الطلب</span>
                        <span className="text-[0.9rem] font-semibold text-[var(--text-secondary)]" dir="ltr">{new Date(d.createdAt).toLocaleString('ar-EG')}</span>
                    </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row lg:flex-col gap-3 min-w-[180px]">
                {d.status === 'pending' ? (
                  <>
                    <button className="w-full py-3.5 rounded-[16px] bg-emerald-500 text-white font-black text-[0.9rem] border-none shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2" onClick={() => handleAction(d.id, 'approve')}>
                      <img src="https://img.icons8.com/fluency/256/checkmark.png" width={18} height={18} className="brightness-0 invert" alt="موافقة" /> موافقة
                    </button>
                    <button className="w-full py-3.5 rounded-[16px] bg-red-500/10 text-red-500 font-black text-[0.9rem] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2" onClick={() => handleAction(d.id, 'reject')}>
                      <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={18} height={18} alt="رفض" /> رفض الطلب
                    </button>
                  </>
                ) : (
                  <div className="w-full py-3.5 rounded-[16px] bg-[var(--bg-secondary)] text-[var(--text-tertiary)] font-black text-[0.9rem] border border-[var(--border-color)] flex items-center justify-center gap-2 grayscale">
                    <img src="https://img.icons8.com/fluency/256/checked-lock.png" width={18} height={18} alt="مقفل" /> مكتمل
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receipt Modal Overlay */}
      {viewingReceipt && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-fade-in"
            onClick={() => setViewingReceipt(null)}
        >
            <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center border-none cursor-pointer hover:bg-red-500 transition-colors z-[110]">
                <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={24} height={24} alt="close" />
            </button>
            <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <img src={viewingReceipt} alt="Full Receipt" className="max-w-full max-h-[90vh] rounded-[24px] shadow-2xl ring-8 ring-white/5" />
                <a 
                    href={viewingReceipt} 
                    download="receipt.png"
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2.5 rounded-full font-black text-[0.9rem] flex items-center gap-2 no-underline hover:scale-105 transition-all"
                >
                    <img src="https://img.icons8.com/fluency/256/download.png" width={18} height={18} alt="download" /> تحميل الإيصال
                </a>
            </div>
        </div>
      )}
    </div>
  );
}
