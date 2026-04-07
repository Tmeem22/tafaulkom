"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AdminTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/tickets');
      const data = await res.json();
      if (data.tickets) setTickets(data.tickets);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAction = async (id: number, action: 'close') => {
    const confirmation = window.confirm('هل أنت متأكد من إغلاق التذكرة؟');
    if (!confirmation) return;

    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        showToast("تم إغلاق التذكرة بنجاح", "success");
        fetchTickets();
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
          <img src="https://img.icons8.com/fluency/256/headset.png" width={40} height={40} alt="أيقونة الدعم الفني" /> تذاكر الدعم الفني
        </h1>
        <p className="text-[var(--text-secondary)]">الرد على استفسارات المستخدمين ومتابعة مشاكل الطلبات.</p>
      </div>

      <div className="flex flex-col gap-6">
        {tickets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mb-4 flex justify-center">
              <img src="https://img.icons8.com/fluency/256/mailbox-closed-flag-down.png" width={64} height={64} className="opacity-50" alt="لا توجد تذاكر" />
            </div>
            <h3 className="text-[var(--text-primary)]">لا توجد تذاكر دعم حالياً</h3>
          </div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className="card p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[1.2rem] font-bold text-[var(--text-primary)]">رد رقم #{t.id} : {t.subject}</h3>
                  {t.status === 'open' ? (
                     <span className="px-3 py-1.5 rounded-full text-[0.75rem] font-bold bg-amber-500/10 text-[var(--brand-accent)] inline-flex items-center gap-1.5 whitespace-nowrap">
                       <img src="https://img.icons8.com/fluency/256/feedback.png" width={14} height={14} alt="مفتوح" /> مفتوحة
                     </span>
                  ) : (
                     <span className="px-3 py-1.5 rounded-full text-[0.75rem] font-bold bg-emerald-500/10 text-[var(--brand-success)] inline-flex items-center gap-1.5 whitespace-nowrap">
                       <img src="https://img.icons8.com/fluency/256/checkmark.png" width={14} height={14} alt="مغلق" /> مغلقة
                     </span>
                  )}
                </div>
                <div className="flex gap-5 text-[0.8rem] text-[var(--text-secondary)] mb-5 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <img src="https://img.icons8.com/fluency/256/customer-insight.png" width={16} height={16} alt="مستخدم" /> <strong>المستخدم:</strong> {t.user?.username} ({t.user?.email})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <img src="https://img.icons8.com/fluency/256/calendar.png" width={16} height={16} alt="تاريخ" /> <strong>التاريخ:</strong> {new Date(t.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>
                
                <div className="bg-[var(--bg-secondary)] p-6 rounded-[var(--radius-lg)] border-r-4 border-[var(--brand-primary)] whitespace-pre-wrap leading-relaxed text-[0.9rem] text-[var(--text-primary)] shadow-inner">
                  {t.message}
                </div>
              </div>

              <div className="min-w-[170px] w-full md:w-auto flex flex-col gap-3">
                {t.status === 'open' ? (
                  <>
                    <button className="btn-primary !p-3 flex items-center justify-center gap-2.5 text-center text-[0.9rem]" onClick={() => handleAction(t.id, 'close')}>
                      <img src="https://img.icons8.com/fluency/256/checkmark.png" width={18} height={18} className="brightness-0 invert" alt="إغلاق التذكرة" /> إغلاق التذكرة
                    </button>
                    <a href={`mailto:${t.user?.email}`} className="btn-secondary !p-3 flex items-center justify-center gap-2.5 text-center no-underline text-[0.9rem]">
                      <img src="https://img.icons8.com/fluency/256/envelope.png" width={18} height={18} alt="بريد" /> مراسلة العميل
                    </a>
                  </>
                ) : (
                  <button className="btn-secondary opacity-60 cursor-not-allowed w-full !p-3 flex items-center justify-center gap-2.5 text-[0.9rem]" disabled>
                    <img src="https://img.icons8.com/fluency/256/checked-lock.png" width={18} height={18} alt="معالج" /> تم المعالجة
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
