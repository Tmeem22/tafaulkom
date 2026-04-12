"use client";
import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCurrency } from '@/components/CurrencyProvider';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png', active: true },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png' },
  { label: 'API', href: '/api-docs', icon: 'https://img.icons8.com/fluency/256/code.png' },
];

type TicketStatus = 'open' | 'closed';

const statusConfig: Record<TicketStatus, { label: string; colorClass: string; bgClass: string }> = {
  open: { label: 'مفتوحة / قيد المراجعة', colorClass: 'text-[var(--brand-accent)]', bgClass: 'bg-amber-500/10' },
  closed: { label: 'مغلقة', colorClass: 'text-[var(--text-tertiary)]', bgClass: 'bg-[var(--bg-secondary)]' },
};

const subjects = [
  'طلب تعويض / Refill',
  'إلغاء طلب / Cancel',
  'مشكلة في الإيداع',
  'مشكلة تقنية',
  'استفسار عام',
];

export default function Support() {
  const { currency, formatPrice } = useCurrency();
  const [tickets, setTickets] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showNewTicket, setShowNewTicket] = useState(false);
  const [subject, setSubject] = useState(subjects[0]);
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [submitObj, setSubmitObj] = useState({ loading: false, error: '' });

  const [filter, setFilter] = useState<'all' | TicketStatus>('all');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const fetchTickets = async () => {
    try {
      const uRes = await fetch('/api/user/me');
      const uData = await uRes.json();
      if (uData.id) setUser(uData);

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

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket);
    }
  }, [selectedTicket]);

  const fetchMessages = async (ticketId: number) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => {
          const container = document.getElementById('user-chat-container');
          if (container) container.scrollTop = container.scrollHeight;
        }, 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitObj({ loading: true, error: '' });
    const needsOrder = subject.includes('تعويض') || subject.includes('إلغاء') || subject.includes('Refill') || subject.includes('Cancel');
    const finalOrderId = needsOrder ? orderId : '';

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, orderId: finalOrderId })
      });
      if (res.ok) {
        setShowNewTicket(false);
        setSubject(subjects[0]);
        setOrderId('');
        setMessage('');
        fetchTickets();
        showToast('تم إرسال التذكرة بنجاح', 'success');
      } else {
        const data = await res.json();
        setSubmitObj({ loading: false, error: data.error || 'حدث خطأ' });
      }
    } catch (error) {
      setSubmitObj({ loading: false, error: 'فشل الاتصال' });
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${selectedTicket}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      });
      if (res.ok) {
        setReply('');
        fetchMessages(selectedTicket);
        showToast('تم إرسال الرد', 'success');
      }
    } catch (error) {
      showToast('خطأ في الاتصال', 'error');
    } finally {
      setSending(false);
    }
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px]">
        <aside className="w-[250px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 flex flex-col gap-1 fixed top-[70px] bottom-0 overflow-y-auto hidden md:flex transition-all">
          <div className="p-4 bg-[var(--gradient-primary)] rounded-[var(--radius-lg)] mb-4 text-center shadow-lg shadow-purple-500/20">
            <p className="text-white/80 text-[0.75rem] font-bold uppercase tracking-wider mb-1">الرصيد الحالي</p>
            <p className="text-white text-[1.8rem] font-black tracking-tight" dir="ltr">{formatPrice(user?.balance || 0)}</p>
          </div>
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-3 rounded-[var(--radius-md)] no-underline flex items-center gap-3 text-[0.9rem] font-bold transition-all ${l.active ? 'bg-[var(--bg-secondary)] text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} alt={l.label} width={20} height={20} /> {l.label}
            </Link>
          ))}
        </aside>

        <div className="flex-1 md:mr-[250px] p-6 md:p-12 transition-all">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-[1.8rem] font-black text-[var(--text-primary)] mb-2">الدعم الفني</h1>
                <p className="text-[0.9rem] text-[var(--text-secondary)]">أرسل تذكرة وسيتم الرد خلال أقل من 24 ساعة</p>
              </div>
              <button className="btn-primary !px-8 !py-3 font-bold" onClick={() => setShowNewTicket(true)}>تذكرة جديدة</button>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {(['all', 'open', 'closed'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full border-2 font-bold text-[0.85rem] transition-all ${filter === f ? 'bg-[var(--gradient-cta)] text-white border-transparent' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)]'}`}>
                  {f === 'all' ? 'الكل' : statusConfig[f].label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {filtered.map(ticket => {
                const sc = statusConfig[ticket.status as TicketStatus] || statusConfig.open;
                const isOpen = selectedTicket === ticket.id;
                return (
                  <div key={ticket.id} className="card">
                    <div className="p-5 cursor-pointer flex justify-between items-center" onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-[0.6rem] font-bold ${sc.bgClass} ${sc.colorClass} mb-2 inline-block`}>{sc.label}</span>
                        <h3 className="font-bold">#{ticket.id} - {ticket.subject}</h3>
                      </div>
                      <span className="text-[0.7rem] text-[var(--text-tertiary)]">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    {isOpen && (
                      <div className="p-5 border-t border-[var(--border-color)]">
                        <div id="user-chat-container" className="flex flex-col gap-4 max-h-[300px] overflow-y-auto mb-4">
                           <div className="bg-[var(--bg-secondary)] p-3 rounded-lg text-sm">{ticket.message}</div>
                           {/* ... messages ... */}
                           {messages.map(m => (
                             <div key={m.id} className={`p-3 rounded-lg text-sm ${m.role === 'ADMIN' ? 'bg-blue-500/10 self-end text-blue-700' : 'bg-gray-100 self-start'}`}>{m.message}</div>
                           ))}
                        </div>
                        {ticket.status === 'open' && (
                          <form onSubmit={handleReply} className="flex gap-2">
                             <input type="text" className="input-field flex-1" placeholder="اكتب ردك..." value={reply} onChange={e => setReply(e.target.value)} />
                             <button type="submit" className="btn-primary" disabled={sending}>رد</button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showNewTicket && (
        <div className="popup-overlay fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowNewTicket(false)}>
          <div className="card p-8 max-w-[500px] w-full mx-4" onClick={e => e.stopPropagation()} dir="rtl">
            <h2 className="font-black mb-6">تذكرة جديدة</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <select className="input-field" title="موضوع التذكرة" value={subject} onChange={e => setSubject(e.target.value)}>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {subject.includes('تعويض') && <input className="input-field" placeholder="رقم الطلب" value={orderId} onChange={e => setOrderId(e.target.value)} required />}
              <textarea className="input-field h-[120px]" placeholder="محتوى الرسالة..." value={message} onChange={e => setMessage(e.target.value)} required />
              <button type="submit" className="btn-primary py-4" disabled={submitObj.loading}>إرسال</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
