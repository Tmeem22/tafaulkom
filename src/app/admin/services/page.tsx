"use client";

import { useState, useEffect, useCallback } from 'react';
import { showToast } from '@/hooks/useNotification';
import { CURRENCY_SYMBOL, USD_TO_SAR_RATE } from '@/lib/constants';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newRate, setNewRate] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services?page=${page}&search=${search}&category=${category}`);
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
        setTotalPages(data.pages);
        setCategories(data.categories || []);
      }
    } catch (err) {
      showToast("فشلت عملية جلب الخدمات", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchServices]);

  const handleUpdate = async (id: number, active?: boolean, customRateValue?: string | null) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active, customRate: customRateValue })
      });
      if (res.ok) {
        showToast("تم التحديث بنجاح", "success");
        setEditingId(null);
        fetchServices();
      } else {
        showToast("فشل التحديث", "error");
      }
    } catch (err) {
      showToast("خطأ في الاتصال بالسيرفر", "error");
    }
  };

  const handleRateSave = (id: number) => {
    handleUpdate(id, undefined, newRate === '' ? null : newRate);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-[2rem] font-extrabold text-[var(--text-primary)] mb-2">إدارة الخدمات</h1>
          <p className="text-[var(--text-secondary)]">التحكم في الأسعار وتفعيل/تعطيل الخدمات من المزود.</p>
        </div>
        <div className="flex gap-4 w-full max-w-[600px]">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو الرقم..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">🔍</span>
          </div>
          <select 
            className="input-field w-[200px]" 
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            aria-label="Filter by Category"
          >
            <option value="">جميع الأقسام</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              <th className="p-4 text-right">ID</th>
              <th className="p-4 text-right">الخدمة</th>
              <th className="p-4 text-center">تكلفة المزود ({CURRENCY_SYMBOL})</th>
              <th className="p-4 text-center">سعرك المخصص ({CURRENCY_SYMBOL})</th>
              <th className="p-4 text-center">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-12 text-center text-[var(--text-secondary)]">جاري التحميل...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-[var(--text-secondary)]">لا توجد نتائج</td></tr>
            ) : services.map(s => (
              <tr key={s.id} className={`border-b border-[var(--border-color)] transition-opacity ${s.active ? 'opacity-100' : 'opacity-50'}`}>
                <td className="p-4 font-semibold">{s.id}</td>
                <td className="p-4">
                  <div className="text-[0.9rem] font-bold text-[var(--text-primary)]">{s.name}</div>
                  <div className="text-[0.75rem] text-[var(--text-tertiary)]">{s.category}</div>
                </td>
                <td className="p-4 text-center text-[var(--text-secondary)]">{(s.originalRate * USD_TO_SAR_RATE).toFixed(4)} {CURRENCY_SYMBOL}</td>
                <td className="p-4 text-center">
                  {editingId === s.id ? (
                    <div className="flex gap-2 justify-center">
                      <input 
                        type="number" 
                        step="0.0001"
                        value={newRate} 
                        onChange={(e) => setNewRate(e.target.value)}
                        className="input-field w-[100px] text-center h-8"
                        aria-label="تعديل السعر"
                        title="أدخل السعر الجديد"
                      />
                      <button onClick={() => handleRateSave(s.id)} className="btn-primary py-1 px-2 text-[0.75rem]">حفظ</button>
                    </div>
                  ) : (
                    <div className={`font-extrabold ${s.customRate ? 'text-[var(--brand-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {s.customRate ? `${s.customRate.toFixed(4)} ${CURRENCY_SYMBOL}` : 'تلقائي (+50%)'}
                    </div>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleUpdate(s.id, !s.active)}
                    className={`px-3 py-1.5 rounded-full border-none font-bold cursor-pointer ${
                      s.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {s.active ? 'نشط' : 'معطل'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => { setEditingId(editingId === s.id ? null : s.id); setNewRate(s.customRate?.toString() || ''); }}
                    className="bg-none border-none text-[var(--brand-primary)] cursor-pointer font-semibold hover:underline"
                  >
                    {editingId === s.id ? 'إلغاء' : 'تعديل السعر'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary px-4 py-2">السابق</button>
        <span className="flex items-center px-4 font-bold">{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary px-4 py-2">التالي</button>
      </div>
    </div>
  );
}
