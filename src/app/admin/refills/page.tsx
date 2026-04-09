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
        showToast(action === 'APPROVE' ? "تم قبول طلب التعويض" : "تم رفض طلب التعويض", "success");
        fetchRefills();
      } else {
        showToast(data.error || "فشلت العملية", "error");
      }
    } catch (err) {
      showToast("خطأ في الاتصال بالسيرفر", "error");
    }
  };

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <div className="animate-fade-in">
       <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--text-primary)]">إدارة طلبات التعويض</h1>
          <p className="text-[var(--text-secondary)]">مراجعة والتحقق من طلبات التعويض المقدمة من المستخدمين.</p>
       </div>

       <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-color)] overflow-hidden shadow-lg">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                <th className="p-4 px-6 text-[0.85rem] font-bold">المستخدم</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold">الخدمة</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold">رقم طلب المورد</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold">التاريخ</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {refills.map((refill) => (
                <tr key={refill.id} className="border-b border-[var(--border-color)] hover:bg-[var(--brand-primary)]/5">
                  <td className="p-4 px-6 font-bold">{refill.user?.username}</td>
                  <td className="p-4 px-6 font-medium">{refill.service}</td>
                  <td className="p-4 px-6 text-[var(--brand-primary)] font-mono">{refill.providerOrderId}</td>
                  <td className="p-4 px-6 text-sm">{new Date(refill.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4 px-6 flex gap-2">
                    <button 
                      onClick={() => handleAction(refill.id, 'APPROVE')}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-600 transition-all"
                    >
                      قبول وإرسال
                    </button>
                    <button 
                      onClick={() => handleAction(refill.id, 'REJECT')}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-all"
                    >
                      رفض
                    </button>
                  </td>
                </tr>
              ))}
              {refills.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center opacity-50">لا توجد طلبات معلقة حالياً.</td>
                </tr>
              )}
            </tbody>
          </table>
       </div>
    </div>
  );
}
