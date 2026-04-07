"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const confirmation = window.confirm(`هل أنت متأكد من رغبتك في ${action === 'approve' ? 'موافقة' : 'رفض'} هذا الطلب؟\n(في حالة الموافقة سيتم إضافة المبلغ لرصيد العميل مباشرةً)`);
    if (!confirmation) return;

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
    return <div className="flex items-center justify-center h-[50vh]">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[2rem] font-extrabold text-[var(--text-primary)] flex items-center gap-3">
          <img src="https://img.icons8.com/fluency/256/money.png" width={40} height={40} alt="أيقونة الأموال" /> الإيداعات المالية
        </h1>
        <p className="text-[var(--text-secondary)]">مراجعة عمليات تحويل الأموال وتأكيدها بناءً على الإيصالات المرفقة</p>
      </div>

      <div className="flex flex-col gap-6">
        {deposits.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mb-4 flex justify-center">
              <img src="https://img.icons8.com/fluency/256/mailbox-closed-flag-down.png" width={64} height={64} className="opacity-50" alt="لا توجد طلبات" />
            </div>
            <h3 className="text-[var(--text-primary)]">لا توجد طلبات إيداع حالياً</h3>
          </div>
        ) : (
          deposits.map(d => (
            <div key={d.id} className="card p-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center">
              
              {/* Receipt Image */}
              <div className="w-[150px] h-[150px] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center border border-[var(--border-color)]">
                <img src={d.receiptImage} alt={`إيصال رقم ${d.id}`} className="max-w-full max-h-full object-contain" />
              </div>

              {/* Details */}
              <div>
                <h3 className="text-[1.2rem] font-bold text-[var(--text-primary)] mb-2">طلب إيداع #{d.id}</h3>
                <div className="grid grid-cols-[auto_auto] gap-1 text-[0.9rem] text-[var(--text-secondary)]">
                  <span><strong>المبلغ:</strong></span>
                  <span className="text-[var(--brand-primary)] font-extrabold" dir="ltr">{d.amount.toFixed(2)} {CURRENCY_SYMBOL}</span>
                  
                  <span><strong>الطريقة:</strong></span>
                  <span>{d.method}</span>
                  
                  <span><strong>المستخدم:</strong></span>
                  <span dir="ltr">{d.user?.username || 'غير معروف'} ({d.user?.email || ''})</span>

                  <span><strong>التاريخ:</strong></span>
                  <span dir="ltr">{new Date(d.createdAt).toLocaleString('ar-SA')}</span>
                  
                  <span><strong>الحالة:</strong></span>
                  <span className="flex">
                    {d.status === 'pending' && <span className="text-amber-500 font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[0.75rem]"><img src="https://img.icons8.com/fluency/256/hourglass.png" width={14} height={14} alt="انتظار" /> قيد المراجعة</span>}
                    {d.status === 'completed' && <span className="text-emerald-500 font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[0.75rem]"><img src="https://img.icons8.com/fluency/256/checkmark.png" width={14} height={14} alt="تم" /> تمت الموافقة</span>}
                    {d.status === 'rejected' && <span className="text-red-500 font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-[0.75rem]"><img src="https://img.icons8.com/fluency/256/delete-sign.png" width={14} height={14} alt="مرفوض" /> مرفوض</span>}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 min-w-[160px]">
                {d.status === 'pending' ? (
                  <>
                    <button className="btn-primary !bg-[var(--brand-success)] !shadow-none flex items-center justify-center gap-2 p-3 text-[0.9rem]" onClick={() => handleAction(d.id, 'approve')}>
                      <img src="https://img.icons8.com/fluency/256/checkmark.png" width={16} height={16} className="brightness-0 invert" alt="موافقة" /> موافقة
                    </button>
                    <button className="btn-secondary !text-[var(--brand-danger)] !border-[var(--brand-danger)] flex items-center justify-center gap-2 p-3 text-[0.9rem]" onClick={() => handleAction(d.id, 'reject')}>
                      <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={16} height={16} alt="رفض" /> رفض
                    </button>
                  </>
                ) : (
                  <button className="btn-secondary opacity-60 cursor-not-allowed flex items-center justify-center gap-2 p-3 text-[0.9rem]" disabled>
                    <img src="https://img.icons8.com/fluency/256/checked-lock.png" width={16} height={16} alt="مقفل" /> مغلق
                  </button>
                )}
                <a href={d.receiptImage} target="_blank" rel="noopener noreferrer" className="btn-secondary text-[0.8rem] p-2.5 text-center flex items-center justify-center gap-2 no-underline">
                  <img src="https://img.icons8.com/fluency/256/search.png" width={16} height={16} alt="فحص" /> فحص الإيصال
                </a>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
