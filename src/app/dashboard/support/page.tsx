"use client";
import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: '🛒' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: '📋' },
  { label: 'خدماتنا', href: '/services', icon: '⚡' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: '💳' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: '🎧', active: true },
  { label: 'API', href: '/api-docs', icon: '🔗' },
];

type TicketStatus = 'open' | 'closed';

const statusConfig: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'مفتوحة / قيد المراجعة', color: 'var(--brand-accent)', bg: 'rgba(245,158,11,0.1)' },
  closed: { label: 'مغلقة', color: 'var(--text-tertiary)', bg: 'var(--bg-secondary)' },
};

const subjects = [
  'طلب تعويض / Refill',
  'إلغاء طلب / Cancel',
  'مشكلة في الإيداع',
  'مشكلة تقنية',
  'استفسار عام',
];

export default function Support() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New ticket state
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [subject, setSubject] = useState(subjects[0]);
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [submitObj, setSubmitObj] = useState({ loading: false, error: '' });

  const [filter, setFilter] = useState<'all' | TicketStatus>('all');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const fetchTickets = async () => {
    try {
      const uRes = await fetch('/api/user/me');
      const uData = await uRes.json();
      if (uData.user) setUser(uData.user);

      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitObj({ loading: true, error: '' });

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, orderId })
      });
      const data = await res.json();
      
      if (res.ok) {
        setShowNewTicket(false);
        setSubject(subjects[0]);
        setOrderId('');
        setMessage('');
        fetchTickets();
        showToast('تم إرسال التذكرة بنجاح', 'success');
      } else {
        setSubmitObj({ loading: false, error: data.error || 'حدث خطأ غير متوقع' });
      }
    } catch (err) {
      setSubmitObj({ loading: false, error: 'فشل الاتصال بالخادم' });
    }
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <>
      <Navbar />
      <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', paddingTop: '70px' }}>
        <aside style={{ width: '250px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'fixed', top: '70px', bottom: '0', overflowY: 'auto' }}>
          <div style={{ padding: '1rem', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>الرصيد الحالي</p>
            <p style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900 }} dir="ltr">${user?.balance?.toFixed(2) || '0.00'}</p>
          </div>
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 600, background: l.active ? 'var(--bg-secondary)' : 'transparent', color: l.active ? 'var(--brand-primary)' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid var(--border-color)' }}>
            <button onClick={() => { document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; window.location.href="/login"; }} style={{ background: 'none', border: 'none', width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-danger)', cursor: 'pointer' }}>🚪 تسجيل الخروج</button>
          </div>
        </aside>

        <div style={{ flex: 1, marginRight: '250px', padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>الدعم الفني 🎧</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>أرسل تذكرة وسيتم الرد خلال أقل من 24 ساعة</p>
              </div>
              <button className="btn-primary" onClick={() => setShowNewTicket(true)} style={{ padding: '0.7rem 2rem', fontSize: '0.9rem' }}>
                ✏️ تذكرة جديدة
              </button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'تذاكر مفتوحة', value: tickets.filter(t => t.status === 'open').length, icon: '📭', color: 'var(--brand-accent)' },
                { label: 'مغلقة', value: tickets.filter(t => t.status === 'closed').length, icon: '✅', color: 'var(--text-tertiary)' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(['all', 'open', 'closed'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${filter === f ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                  background: filter === f ? 'var(--gradient-cta)' : 'var(--bg-card)',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                  fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                }}>
                  {f === 'all' ? 'الكل' : statusConfig[f].label}
                </button>
              ))}
            </div>

            {/* Tickets List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>جاري التحميل...</div>
              ) : filtered.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📭</span>
                  <p style={{ color: 'var(--text-tertiary)' }}>لا توجد تذاكر</p>
                </div>
              ) : filtered.map(ticket => {
                const sc = statusConfig[ticket.status as TicketStatus] || statusConfig.open;
                return (
                  <div key={ticket.id} className="card" style={{ padding: '1.2rem 1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-primary-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)' }}>رد رقم #{ticket.id}</span>
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 700, background: sc.bg, color: sc.color }}>{sc.label}</span>
                        </div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ticket.subject}</h3>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }} dir="ltr">{new Date(ticket.createdAt).toLocaleString('ar-SA')}</p>
                      </div>
                    </div>

                    {selectedTicket === ticket.id && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(108,60,225,0.06)', borderRight: '3px solid var(--brand-primary)' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>المحتوى:</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{ticket.message}</p>
                          </div>
                          {ticket.status === 'closed' && (
                            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.06)', borderRight: '3px solid var(--brand-success)' }}>
                              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-success)', marginBottom: '0.25rem' }}>الرد من الإدارة:</p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>تم الرد وإغلاق هذه التذكرة. إذا كان لديك استفسار آخر يرجى فتح تذكرة جديدة.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="popup-overlay" onClick={() => setShowNewTicket(false)}>
          <div className="card animate-fade-in-up" onClick={e => e.stopPropagation()} style={{ padding: '2.5rem', maxWidth: '550px', width: '90%' }} dir="rtl">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>✏️ تذكرة جديدة</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>اكتب تفاصيل مشكلتك وسيتم الرد في أقرب وقت</p>
            
            {submitObj.error && (
               <div style={{ padding: '0.8rem', background: 'rgba(239,68,68,0.1)', color: 'var(--brand-danger)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                  ⚠️ {submitObj.error}
               </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>الموضوع</label>
                <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)} style={{ cursor: 'pointer' }}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {(subject.includes('تعويض') || subject.includes('إلغاء') || subject.includes('مشكلة في طلب')) && (
                 <div className="animate-fade-in">
                   <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-accent)', marginBottom: '0.4rem' }}>رقم الطلب (سيتم التحقق منه تلقائياً! 🕵️‍♂️)</label>
                   <input className="input-field" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="مثال: 1044" dir="ltr" required />
                 </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>الرسالة</label>
                <textarea className="input-field" value={message} onChange={e => setMessage(e.target.value)} required rows={4} placeholder="اكتب تفاصيل المشكلة أو الاستفسار المخصص..." style={{ resize: 'vertical', minHeight: '120px' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={submitObj.loading} className="btn-primary" style={{ flex: 1, padding: '0.85rem' }}>{submitObj.loading ? 'جاري الإرسال...' : '📤 إرسال التذكرة'}</button>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.85rem' }} onClick={() => setShowNewTicket(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) { aside { display: none !important; } }
      `}</style>
    </>
  );
}
