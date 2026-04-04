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
    } catch (e) {
      showToast("فشل الاتصال بالخادم", "error");
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>تذاكر الدعم الفني 🎧</h1>
        <p style={{ color: 'var(--text-secondary)' }}>الرد على استفسارات المستخدمين ومتابعة مشاكل الطلبات.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {tickets.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
            <h3 style={{ color: 'var(--text-primary)' }}>لا توجد تذاكر دعم حالياً</h3>
          </div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>رد رقم #{t.id} : {t.subject}</h3>
                  {t.status === 'open' ? (
                     <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', background: 'rgba(245,158,11,0.1)', color: 'var(--brand-accent)' }}>مفتوحة</span>
                  ) : (
                     <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', background: 'rgba(16,185,129,0.1)', color: 'var(--brand-success)' }}>مغلقة</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <span><strong>المستخدم:</strong> {t.user?.username} ({t.user?.email})</span>
                  <span><strong>التاريخ:</strong> {new Date(t.createdAt).toLocaleString('ar-SA')}</span>
                </div>
                
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--brand-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {t.message}
                </div>
              </div>

              <div style={{ minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {t.status === 'open' ? (
                  <>
                    <button className="btn-secondary" style={{ color: 'var(--brand-danger)', borderColor: 'var(--brand-danger)' }} onClick={() => handleAction(t.id, 'close')}>✕ إغلاق التذكرة</button>
                    <a href={`mailto:${t.user?.email}`} className="btn-primary" style={{ textAlign: 'center' }}>📧 مراسلة العميل عبر البريد</a>
                  </>
                ) : (
                  <button className="btn-secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>مغلقة</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
