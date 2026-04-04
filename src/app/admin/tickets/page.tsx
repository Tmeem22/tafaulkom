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
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src="https://img.icons8.com/parakeet/256/headset.png" width={40} height={40} /> تذاكر الدعم الفني
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>الرد على استفسارات المستخدمين ومتابعة مشاكل الطلبات.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {tickets.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <img src="https://img.icons8.com/parakeet/256/mailbox-closed-flag-down.png" width={64} height={64} style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{ color: 'var(--text-primary)' }}>لا توجد تذاكر دعم حالياً</h3>
          </div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>رد رقم #{t.id} : {t.subject}</h3>
                  {t.status === 'open' ? (
                     <span style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245,158,11,0.1)', color: 'var(--brand-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                       <img src="https://img.icons8.com/parakeet/256/feedback.png" width={14} height={14} /> مفتوحة
                     </span>
                  ) : (
                     <span style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16,185,129,0.1)', color: 'var(--brand-success)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                       <img src="https://img.icons8.com/parakeet/256/checkmark.png" width={14} height={14} /> مغلقة
                     </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <img src="https://img.icons8.com/parakeet/256/customer-insight.png" width={16} height={16} /> <strong>المستخدم:</strong> {t.user?.username} ({t.user?.email})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <img src="https://img.icons8.com/parakeet/256/calendar.png" width={16} height={16} /> <strong>التاريخ:</strong> {new Date(t.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>
                
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderRight: '4px solid var(--brand-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.9rem', color: 'var(--text-primary)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                  {t.message}
                </div>
              </div>

              <div style={{ minWidth: '170px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {t.status === 'open' ? (
                  <>
                    <button className="btn-primary" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.8rem' }} onClick={() => handleAction(t.id, 'close')}>
                      <img src="https://img.icons8.com/parakeet/256/checkmark.png" width={18} height={18} style={{ filter: 'brightness(0) invert(1)' }} /> إغلاق التذكرة
                    </button>
                    <a href={`mailto:${t.user?.email}`} className="btn-secondary" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.8rem' }}>
                      <img src="https://img.icons8.com/parakeet/256/envelope.png" width={18} height={18} /> مراسلة العميل
                    </a>
                  </>
                ) : (
                  <button className="btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed', width: '100%' }}>
                    <img src="https://img.icons8.com/parakeet/256/checked-lock.png" width={18} height={18} /> تم المعالجة
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
