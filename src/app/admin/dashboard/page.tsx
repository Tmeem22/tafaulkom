"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CURRENCY_SYMBOL } from '@/lib/constants';

const statIcons = {
  users: "https://img.icons8.com/fluency/256/group-of-projects.png",
  orders: "https://img.icons8.com/fluency/256/shopping-cart.png",
  deposits: "https://img.icons8.com/fluency/256/money.png",
  tickets: "https://img.icons8.com/fluency/256/headset.png",
  sales: "https://img.icons8.com/fluency/256/sales-performance.png"
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentDeposits, setRecentDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
        setRecentDeposits(data.recentDeposits || []);
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] opacity-50">
          <img src="https://img.icons8.com/fluency/256/dashboard.png" width={64} height={64} className="animate-pulse mb-4" alt="تحميل" />
          <p className="font-bold">جاري تحميل بيانات لوحة التحكم...</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-[1200px] mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] flex items-center gap-4">
            <img src="https://img.icons8.com/fluency/256/dashboard.png" width={45} height={45} alt="نظرة عامة" /> نظرة عامة
          </h1>
          <p className="text-[var(--text-secondary)] font-medium">متابعة أداء المنصة والنشاطات الأخيرة في الوقت الفعلي.</p>
        </div>
        <div className="flex items-center gap-4 bg-[var(--bg-card)] p-3 px-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <div className="relative">
                <span className="flex h-3 w-3 absolute -top-1 -right-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <img src="https://img.icons8.com/fluency/256/shield.png" width={24} height={24} alt="security" />
            </div>
            <div className="text-right">
                <p className="text-[0.65rem] font-black text-[var(--text-tertiary)] uppercase leading-none mb-1">حالة النظام</p>
                <p className="text-[0.85rem] font-bold text-emerald-500 leading-none">مؤمن ومستقر</p>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card p-6 flex flex-col gap-4 hover:border-blue-500/50 group transition-all">
          <div className="flex justify-between items-start">
            <div className="bg-blue-500/10 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <img src={statIcons.users} width={28} height={28} alt="users" />
            </div>
            <span className="text-[0.7rem] font-black text-blue-500 bg-blue-500/10 p-1 px-3 rounded-full">المستخدمين</span>
          </div>
          <div>
            <p className="text-[0.85rem] font-bold text-[var(--text-secondary)] mb-1">إجمالي الأعضاء</p>
            <h3 className="text-[1.8rem] font-black text-[var(--text-primary)] leading-none">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-4 hover:border-emerald-500/50 group transition-all">
          <div className="flex justify-between items-start">
            <div className="bg-emerald-500/10 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <img src={statIcons.orders} width={28} height={28} alt="orders" />
            </div>
            <span className="text-[0.7rem] font-black text-emerald-500 bg-emerald-500/10 p-1 px-3 rounded-full">تم التنفيذ</span>
          </div>
          <div>
            <p className="text-[0.85rem] font-bold text-[var(--text-secondary)] mb-1">الطلبات الناجحة</p>
            <h3 className="text-[1.8rem] font-black text-emerald-500 leading-none">{stats?.completedOrders || 0}</h3>
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-4 hover:border-amber-500/50 group transition-all">
          <div className="flex justify-between items-start">
            <div className="bg-amber-500/10 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <img src={statIcons.sales} width={28} height={28} alt="sales" />
            </div>
            <span className="text-[0.7rem] font-black text-amber-500 bg-amber-500/10 p-1 px-3 rounded-full">مالية</span>
          </div>
          <div>
            <p className="text-[0.85rem] font-bold text-[var(--text-secondary)] mb-1">إجمالي المبيعات</p>
            <h3 className="text-[1.8rem] font-black text-amber-500 leading-none" dir="ltr">{(stats?.totalSales || 0).toFixed(2)} {CURRENCY_SYMBOL}</h3>
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-4 hover:border-red-500/50 group transition-all">
          <div className="flex justify-between items-start">
            <div className="bg-red-500/10 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <img src={statIcons.tickets} width={28} height={28} alt="tickets" />
            </div>
            <span className="text-[0.7rem] font-black text-red-500 bg-red-500/10 p-1 px-3 rounded-full">الدعم</span>
          </div>
          <div>
            <p className="text-[0.85rem] font-bold text-[var(--text-secondary)] mb-1">تذاكر مفتوحة</p>
            <h3 className="text-[1.8rem] font-black text-red-500 leading-none">{stats?.openTickets || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Recent Activity Table View */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
            <h3 className="text-[1.1rem] font-black flex items-center gap-3">
              <img src="https://img.icons8.com/fluency/256/activity-feed.png" width={24} height={24} alt="activity" /> آخر الحركات المالية
            </h3>
            <Link href="/admin/deposits" className="text-[0.8rem] font-bold text-[var(--brand-primary)] no-underline hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
                <tbody>
                    {recentDeposits.length === 0 ? (
                        <tr><td className="p-12 text-center text-[var(--text-tertiary)] font-bold">لا توجد عمليات مؤخراً</td></tr>
                    ) : (
                        recentDeposits.map((d: any) => (
                            <tr key={d.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/30 transition-all">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${d.status === 'completed' ? 'bg-emerald-500' : d.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                        <div>
                                            <p className="font-bold text-[0.95rem] text-[var(--text-primary)]">{d.user?.username}</p>
                                            <p className="text-[0.75rem] text-[var(--text-tertiary)]">{new Date(d.createdAt).toLocaleString('ar-EG')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-left">
                                    <p className="font-black text-[var(--brand-primary)]" dir="ltr">{d.amount.toFixed(2)} {CURRENCY_SYMBOL}</p>
                                    <p className="text-[0.7rem] text-[var(--text-tertiary)] font-medium uppercase tracking-tighter">{d.method}</p>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-col gap-6">
            <div className="card p-8 bg-[var(--gradient-primary)] text-white relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-[1.3rem] font-black mb-6 relative z-10">إجراءات سريعة ⚡</h3>
                <div className="grid grid-cols-2 gap-3 relative z-10">
                    <Link href="/admin/users" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center no-underline text-white font-black text-[0.85rem] hover:bg-white/20 transition-all border border-white/5">شحن عضو</Link>
                    <Link href="/admin/tickets" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center no-underline text-white font-black text-[0.85rem] hover:bg-white/20 transition-all border border-white/5">رد عاجل</Link>
                    <Link href="/admin/services" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center no-underline text-white font-black text-[0.85rem] hover:bg-white/20 transition-all border border-white/5">تعديل سعر</Link>
                    <Link href="/dashboard" className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-center no-underline text-white font-black text-[0.85rem] hover:bg-white/30 transition-all border border-white/10">المتجر 🛒</Link>
                </div>
            </div>

            <div className="card p-6 border-l-4 border-amber-500 shadow-sm">
                <h4 className="text-[0.9rem] font-black text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <img src="https://img.icons8.com/fluency/256/idea.png" width={18} height={18} alt="tip" />
                    نصيحة للإدارة
                </h4>
                <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed">تأكد من مراجعة الإيداعات المعلقة ( <span className="text-amber-500 font-bold">{stats?.pendingDeposits || 0}</span> ) لضمان رضا العملاء وسرعة الخدمة.</p>
            </div>
        </div>

      </div>
    </div>
  );
}