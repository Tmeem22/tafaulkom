"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: '🛒' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: '📋', active: true },
  { label: 'خدماتنا', href: '/services', icon: '⚡' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: '💳' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: '🎧' },
  { label: 'API', href: '/api-docs', icon: '🔗' },
];

type OrderStatus = 'all' | 'completed' | 'pending' | 'processing' | 'cancelled';

const statusConfig = {
  completed: { label: 'مكتمل', color: 'var(--brand-success)', bg: 'rgba(16,185,129,0.1)', icon: '✓' },
  processing: { label: 'قيد التنفيذ', color: 'var(--brand-primary)', bg: 'rgba(108,60,225,0.1)', icon: '⟳' },
  pending: { label: 'معلّق', color: 'var(--brand-accent)', bg: 'rgba(245,158,11,0.1)', icon: '⏳' },
  cancelled: { label: 'ملغي', color: 'var(--brand-danger)', bg: 'rgba(239,68,68,0.1)', icon: '✕' },
};

export default function Orders() {
  const [filter, setFilter] = useState<OrderStatus>('all');
  const [searchId, setSearchId] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersAndUser = async () => {
      try {
        const [ordersRes, userRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/user/me')
        ]);
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
        
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.balance !== undefined) setBalance(userData.balance);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrdersAndUser();
  }, []);

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (searchId && !o.id.toString().includes(searchId)) return false;
    return true;
  });

  return (
    <>
      <Navbar />
      <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', paddingTop: '70px' }}>
        {/* Sidebar */}
        <aside style={{ width: '250px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'fixed', top: '70px', bottom: '0', overflowY: 'auto' }}>
          <div style={{ padding: '1rem', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>الرصيد الحالي</p>
            <p style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900 }} dir="ltr">${balance !== null ? balance.toFixed(2) : '...'}</p>
            <Link href="/dashboard/deposit" style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
              + شحن رصيد
            </Link>
          </div>

          {sideLinks.map((link, i) => (
            <Link key={i} href={link.href} style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 600,
              background: link.active ? 'var(--bg-secondary)' : 'transparent',
              color: link.active ? 'var(--brand-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}>
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}

          <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid var(--border-color)' }}>
            <Link href="/" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-danger)' }}>
              🚪 تسجيل الخروج
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, marginRight: '250px', padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>طلباتي 📋</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>سجل جميع الطلبات السابقة والحالية</p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'إجمالي الطلبات', value: orders.length.toString(), icon: '📦', color: 'var(--text-primary)' },
                { label: 'مكتملة', value: orders.filter(o => o.status === 'completed').length.toString(), icon: '✅', color: 'var(--brand-success)' },
                { label: 'قيد التنفيذ', value: orders.filter(o => o.status === 'processing').length.toString(), icon: '⚡', color: 'var(--brand-primary)' },
                { label: 'معلّقة', value: orders.filter(o => o.status === 'pending').length.toString(), icon: '⏳', color: 'var(--brand-accent)' },
              ].map((stat, i) => (
                <div key={i} className="card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{stat.label}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: stat.color }}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }}>
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
                <input
                  type="text"
                  className="input-field"
                  placeholder="ابحث برقم الطلب..."
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                  dir="ltr"
                />
              </div>
              {(['all', 'completed', 'processing', 'pending', 'cancelled'] as OrderStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${filter === status ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                    background: filter === status ? 'var(--gradient-cta)' : 'var(--bg-card)',
                    color: filter === status ? 'white' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                >
                  {status === 'all' ? 'الكل' : statusConfig[status].label}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>رقم الطلب</th>
                      <th style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>الخدمة</th>
                      <th style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>الكمية</th>
                      <th style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>التكلفة</th>
                      <th style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>المتبقي</th>
                      <th style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>الحالة</th>
                      <th style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                          جاري تحميل الطلبات...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📭</span>
                          لا توجد طلبات تطابق البحث
                        </td>
                      </tr>
                    ) : filtered.map(order => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig] || statusConfig['pending'];
                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)' }}>#{order.id}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }} dir="ltr">{order.service}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', direction: 'ltr', display: 'block', marginTop: '2px' }}>{order.link}</span>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.quantity.toLocaleString()}</td>
                          <td style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }} dir="ltr">${order.charge.toFixed(4)}</td>
                          <td style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: order.remains > 0 ? 'var(--brand-accent)' : 'var(--text-tertiary)' }}>{order.remains.toLocaleString()}</td>
                          <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, background: sc.bg, color: sc.color, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              {sc.icon} {sc.label}
                            </span>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }} dir="ltr">{new Date(order.date).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination hint */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              عرض {filtered.length} من {orders.length} طلب
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          div[style*="marginRight: '250px'"] { margin-right: 0 !important; }
        }
      `}</style>
    </>
  );
}
