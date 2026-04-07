"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    return <div className="flex items-center justify-center h-[50vh] text-[var(--text-secondary)]">جاري تحميل الإحصائيات...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-[2.2rem] font-extrabold text-[var(--text-primary)] flex items-center gap-3">
          <img src="https://img.icons8.com/fluency/256/dashboard.png" width={45} height={45} alt="نظرة عامة على لوحة التحكم" /> نظرة عامة
        </h1>
        <p className="text-[var(--text-secondary)] text-[1.1rem]">متابعة أداء المنصة والنشاطات الأخيرة في الوقت الفعلي.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mb-12">
        
        <div className="card p-6 flex items-center gap-5">
          <div className="bg-blue-500/10 p-4 rounded-[var(--radius-lg)]">
            <img src={statIcons.users} width={32} height={32} alt="أيقونة المستخدمين" />
          </div>
          <div>
            <p className="text-[0.9rem] text-[var(--text-secondary)] mb-1">إجمالي المستخدمين</p>
            <h3 className="text-[1.5rem] font-extrabold text-[var(--text-primary)]">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <div className="bg-emerald-500/10 p-4 rounded-[var(--radius-lg)]">
            <img src={statIcons.sales} width={32} height={32} alt="أيقونة المبيعات" />
          </div>
          <div>
            <p className="text-[0.9rem] text-[var(--text-secondary)] mb-1">إجمالي المبيعات</p>
            <h3 className="text-[1.5rem] font-extrabold text-[var(--brand-success)]" dir="ltr">${stats?.totalSales?.toFixed(2) || '0.00'}</h3>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <div className="bg-amber-500/10 p-4 rounded-[var(--radius-lg)]">
            <img src={statIcons.deposits} width={32} height={32} alt="أيقونة الإيداعات" />
          </div>
          <div>
            <p className="text-[0.9rem] text-[var(--text-secondary)] mb-1">إيداعات معلقة</p>
            <h3 className="text-[1.5rem] font-extrabold text-[var(--brand-accent)]">{stats?.pendingDeposits || 0}</h3>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <div className="bg-red-500/10 p-4 rounded-[var(--radius-lg)]">
            <img src={statIcons.tickets} width={32} height={32} alt="أيقونة التذاكر" />
          </div>
          <div>
            <p className="text-[0.9rem] text-[var(--text-secondary)] mb-1">تذاكر مفتوحة</p>
            <h3 className="text-[1.5rem] font-extrabold text-[var(--brand-danger)]">{stats?.openTickets || 0}</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recent Activity */}
        <div className="card p-6 text-right" dir="rtl">
          <h3 className="text-[1.2rem] font-bold mb-6 flex items-center gap-2">
            <img src="https://img.icons8.com/fluency/256/activity-feed.png" width={24} height={24} alt="أيقونة النشاط" /> آخر عمليات الشحن
          </h3>
          <div className="flex flex-col gap-4">
            {recentDeposits.length === 0 ? (
               <p className="text-[var(--text-tertiary)] text-center p-4">لا توجد عمليات مؤخراً</p>
            ) : (
              recentDeposits.map((d: any) => (
                <div key={d.id} className="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${d.status === 'completed' ? 'bg-[var(--brand-success)]' : d.status === 'pending' ? 'bg-[var(--brand-accent)]' : 'bg-[var(--brand-danger)]'}`}></div>
                    <div>
                      <p className="font-bold text-[0.9rem] text-[var(--text-primary)]">{d.user?.username}</p>
                      <p className="text-[0.75rem] text-[var(--text-secondary)]">{new Date(d.createdAt).toLocaleString('ar-SA')}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-[var(--brand-primary)]" dir="ltr">${d.amount.toFixed(2)}</p>
                    <p className="text-[0.7rem] text-[var(--text-tertiary)]">{d.method}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions or Tips */}
        <div className="card p-6 bg-[var(--gradient-primary)] text-white text-right" dir="rtl">
          <h3 className="text-[1.2rem] font-bold mb-5 italic">إجراءات سريعة ⚡</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/users" className="no-underline text-white bg-white/10 p-4 rounded-[var(--radius-md)] text-center text-[0.9rem] font-semibold hover:bg-white/20 transition-colors">إضافة رصيد</Link>
            <Link href="/admin/tickets" className="no-underline text-white bg-white/10 p-4 rounded-[var(--radius-md)] text-center text-[0.9rem] font-semibold hover:bg-white/20 transition-colors">الرد على التذاكر</Link>
            <Link href="/admin/deposits" className="no-underline text-white bg-white/10 p-4 rounded-[var(--radius-md)] text-center text-[0.9rem] font-semibold hover:bg-white/20 transition-colors">تدقيق الحوالات</Link>
            <Link href="/dashboard" className="no-underline text-white bg-white/10 p-4 rounded-[var(--radius-md)] text-center text-[0.9rem] font-semibold hover:bg-white/20 transition-colors">معاينة الموقع</Link>
          </div>
          <div className="mt-8 p-4 bg-black/10 rounded-[var(--radius-md)] text-[0.85rem]">
            <p>💡 <strong>نصيحة:</strong> تذكر مراجعة الإيداعات المعلقة يومياً لضمان سرعة معالجة طلبات العملاء.</p>
          </div>
        </div>

      </div>
    </div>
  );
}