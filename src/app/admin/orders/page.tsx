"use client";

import { useState, useEffect, useCallback } from 'react';
import { showToast } from '@/hooks/useNotification';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&status=${status}&search=${search}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
        setTotalPages(data.pages);
        setTotalOrders(data.total);
      } else {
        showToast(data.error || "فشل جلب الطلبات", "error");
      }
    } catch (err) {
      showToast("خطأ في الاتصال بالسيرفر", "error");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  return (
    <div className="animate-fade-in">
       <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] mb-2 tracking-tight">إدارة الطلبات</h1>
            <p className="text-[var(--text-secondary)] font-medium">مراقبة جميع طلبات المستخدمين وحالات التنفيذ (الإجمالي: {totalOrders})</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             <div className="relative w-full md:w-[300px]">
                <input 
                  type="text" 
                  placeholder="بحث برقم الطلب، الرابط، أو المستخدم..." 
                  value={search} 
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="input-field pr-10 h-[52px]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
             </div>
             <select 
                value={status} 
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="input-field w-full md:w-[180px] h-[52px] font-bold"
                aria-label="تصفية حسب الحالة"
             >
                <option value="all">كل الحالات</option>
                <option value="pending">معلق</option>
                <option value="processing">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
                <option value="partial">مكتمل جزئياً</option>
             </select>
          </div>
       </div>

       <div className="card rounded-[28px] overflow-hidden shadow-xl border border-[var(--border-color)]">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الطلب</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">المستخدم</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الخدمة</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الرابط</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الكمية</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">التكلفة</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الحالة</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {loading ? (
                  <tr><td colSpan={8} className="p-20 text-center text-[var(--text-tertiary)] font-bold">جاري تحميل سجلات النظام...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={8} className="p-20 text-center text-[var(--text-tertiary)] font-bold">لا توجد طلبات مسجلة حالياً.</td></tr>
                ) : orders.map(order => (
                  <tr key={order.id} className="hover:bg-[var(--brand-primary)]/[0.02] transition-colors">
                    <td className="p-5 px-6 font-black text-[var(--brand-primary)]">#{order.id}</td>
                    <td className="p-5 px-6">
                       <span className="font-bold text-[var(--text-primary)] block">{order.user?.username}</span>
                       <span className="text-[0.7rem] text-[var(--text-tertiary)]">{order.user?.email}</span>
                    </td>
                    <td className="p-5 px-6">
                       <span className="text-[0.85rem] font-bold text-[var(--text-primary)] block max-w-[200px] truncate" title={order.service}>{order.service}</span>
                    </td>
                    <td className="p-5 px-6">
                       <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-[0.8rem] text-[var(--brand-primary)] font-bold no-underline hover:underline truncate block max-w-[150px]" dir="ltr">{order.link}</a>
                    </td>
                    <td className="p-5 px-6 text-center font-bold text-[var(--text-secondary)]">{order.quantity.toLocaleString()}</td>
                    <td className="p-5 px-6 text-center font-black text-[var(--text-primary)]" dir="ltr">{order.charge.toFixed(4)} {CURRENCY_SYMBOL}</td>
                    <td className="p-5 px-6 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[0.75rem] font-black inline-flex items-center gap-2 ${
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                          order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                          order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                       }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'processing' ? 'animate-pulse' : ''} ${
                             order.status === 'completed' ? 'bg-emerald-500' :
                             order.status === 'processing' ? 'bg-blue-500' :
                             order.status === 'pending' ? 'bg-amber-500' :
                             'bg-red-500'
                          }`}></span>
                          {order.status}
                       </span>
                    </td>
                    <td className="p-5 px-6 text-center text-[0.75rem] font-bold text-[var(--text-tertiary)]" dir="ltr">
                       {new Date(order.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-color)] flex justify-center gap-2">
               <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="btn-secondary px-6 py-2.5 rounded-[15px] font-bold disabled:opacity-30"
               >السابق</button>
               <div className="flex items-center px-6 font-black text-[var(--brand-primary)] bg-white rounded-[15px] shadow-sm shadow-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20">
                  {page} / {totalPages}
               </div>
               <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="btn-secondary px-6 py-2.5 rounded-[15px] font-bold disabled:opacity-30"
               >التالي</button>
            </div>
          )}
       </div>
    </div>
  );
}
