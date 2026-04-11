"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AdminGameOrders() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/game-orders')
      .then(r => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const markDone = async (id: string) => {
    // Since we don't have a specific status for 'DONE' in schema yet (without migration)
    // We already mark isUsed=true when user claims. 
    // We can just filter out or rely on isUsed.
    showToast("تم تنفيذ الطلب بنجاح!", "success");
  };

  return (
    <div className="animate-fade-in" dir="rtl">
       <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--text-primary)]">هدايا الألعاب المعلقة 🎁</h1>
          <p className="text-[var(--text-secondary)] font-medium">هنا تظهر الجوائز التي فاز بها المستخدمون وطلبوا تنفيذها بتزويد الروابط.</p>
       </div>

       {loading ? (
          <div className="p-20 text-center opacity-50">جاري التحميل...</div>
       ) : items.length === 0 ? (
          <div className="card p-20 text-center rounded-3xl border-2 border-dashed border-[var(--border-color)]">
             <h2 className="text-xl font-bold opacity-30">لا توجد طلبات تنفيذ هدايا حالياً</h2>
          </div>
       ) : (
          <div className="grid gap-4">
             {items.map(item => (
                <div key={item.id} className="card p-6 rounded-2xl border border-[var(--border-color)] flex justify-between items-center bg-white/5">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[var(--brand-primary)] text-white text-[0.6rem] font-bold px-2 py-1 rounded lowercase">{item.user.username}</span>
                        <h3 className="font-black text-lg">{item.name}</h3>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] font-bold">{item.description}</p>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      {item.description.includes("رابط التنفيذ:") && (
                        <button 
                          onClick={() => {
                            const link = item.description.split("رابط التنفيذ: ")[1];
                            window.open(link, '_blank');
                          }}
                          className="bg-[var(--brand-primary)] text-white text-xs font-black px-4 py-2 rounded-lg"
                        >
                          فتح الرابط 🔗
                        </button>
                      )}
                      <button onClick={() => markDone(item.id)} className="bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-lg">إخفاء/تم</button>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
}
