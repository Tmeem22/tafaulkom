"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AdminRefills() {
  const [refills, setRefills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRefills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/refills');
      const data = await res.json();
      setRefills(data);
    } catch (err) {
      showToast("فشلت عملية جلب طلبات التعويض", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefills();
  }, []);

  const handleAction = async (orderId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/admin/refills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(action === 'APPROVE' ? "تم قبول طلب التعويض وإرساله للمزود" : "تم رفض طلب التعويض", "success");
        fetchRefills();
      } else {
        showToast(data.error || "فشل معالجة الطلب", "error");
      }
    } catch (err) {
      showToast("خطأ في الاتصال بالسيرفر", "error");
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
        <img src="https://img.icons8.com/fluency/256/hourglass.png" width={48} className="animate-spin opacity-50 mb-4" alt="loading" />
        <p className="font-bold text-[var(--text-tertiary)]">جاري جلب طلبات التعويض...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
       <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--text-primary)]">إدارة طلبات التعويض</h1>
          <p className="text-[var(--text-secondary)] font-medium">مراجعة والتحقق من طلبات التعويض المقدمة من المستخدمين واستيفائها من المزودين.</p>
       </div>

       <div className="card rounded-[24px] overflow-hidden shadow-xl border border-[var(--border-color)]">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الطلب</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">المستخدم</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الخدمة</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">رقم طلب المزود</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الحالة</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">التاريخ</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {refills.map((refill) => (
                  <tr key={refill.id} className="border-b border-[var(--border-color)] hover:bg-[var(--brand-primary)]/[0.02] transition-colors">
                    <td className="p-5 px-6 font-black text-[var(--brand-primary)]">#{refill.id}</td>
                    <td className="p-5 px-6">
                        <span className="font-bold text-[var(--text-primary)] block">{refill.user?.username}</span>
                    </td>
                    <td className="p-5 px-6">
                        <span className="text-[0.85rem] font-bold text-[var(--text-primary)] block max-w-[200px] truncate" title={refill.service}>{refill.service}</span>
                    </td>
                    <td className="p-5 px-6">
                        <span className="text-[0.8rem] font-mono text-[var(--brand-primary)] font-bold bg-[var(--brand-primary)]/5 p-1 px-2 rounded-md">{refill.providerOrderId}</span>
                    </td>
                    <td className="p-5 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[0.7rem] font-black ${
                            refill.refillStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                            refill.refillStatus === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                            'bg-amber-500/10 text-amber-500'
                        }`}>
                            {refill.refillStatus === 'APPROVED' ? 'تم القبول' : refill.refillStatus === 'REJECTED' ? 'مرفوض' : 'قيد الانتظار'}
                        </span>
                    </td>
                    <td className="p-5 px-6 text-[0.75rem] font-bold text-[var(--text-tertiary)]" dir="ltr">
                        {new Date(refill.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-5 px-6 flex justify-center gap-2">
                      {refill.refillStatus === 'PENDING' ? (
                        <>
                          <button 
                            onClick={() => handleAction(refill.id, 'APPROVE')}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all border-none cursor-pointer"
                          >
                            قبول وإرسال
                          </button>
                          <button 
                            onClick={() => handleAction(refill.id, 'REJECT')}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all border-none cursor-pointer"
                          >
                            رفض
                          </button>
                        </>
                      ) : (
                        <span className="text-[0.75rem] font-bold text-[var(--text-tertiary)] italic">تمت المعالجة</span>
                      )}
                    </td>
                  </tr>
                ))}
                {refills.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-20 text-center text-[var(--text-tertiary)] font-bold">لا توجد طلبات تعويض حالياً.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
       </div>
    </div>
  );
}
