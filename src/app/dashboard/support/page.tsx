"use client";
import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CURRENCY_SYMBOL } from '@/lib/constants';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png', active: true },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitObj({ loading: true, error: '' });

    const needsOrder = subject.includes('تعويض') || subject.includes('إلغاء') || subject.includes('مشكلة في طلب') || subject.includes('Refill') || subject.includes('Cancel');
    const finalOrderId = needsOrder ? orderId : '';

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, orderId: finalOrderId })
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
    } catch (error) {
      setSubmitObj({ loading: false, error: 'فشل الاتصال بالخادم' });
    }
  };

  const handleLogout = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

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
        showToast('تم إرسال ردك بنجاح', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'فشل إرسال الرد', 'error');
      }
    } catch (error) {
      showToast('حدث خطأ في الاتصال', 'error');
    } finally {
      setSending(false);
    }
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px]">
        {/* Sidebar */}
        <aside className="w-[250px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 flex flex-col gap-1 fixed top-[70px] bottom-0 overflow-y-auto hidden md:flex transition-all">
          <div className="p-4 bg-[var(--gradient-primary)] rounded-[var(--radius-lg)] mb-4 text-center shadow-lg shadow-purple-500/20">
            <p className="text-white/80 text-[0.75rem] font-bold uppercase tracking-wider mb-1">الرصيد الحالي</p>
            <p className="text-white text-[1.8rem] font-black tracking-tight" dir="ltr">{user?.balance?.toFixed(2) || '0.00'} {CURRENCY_SYMBOL}</p>
          </div>
          {sideLinks.map((l, i) => (
            <Link 
              key={i} 
              href={l.href} 
              className={`p-3 rounded-[var(--radius-md)] no-underline flex items-center gap-3 text-[0.9rem] font-bold transition-all ${
                l.active 
                  ? 'bg-[var(--bg-secondary)] text-[var(--brand-primary)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)]'
              }`}
            >
              <img src={l.icon} alt={l.label} width={20} height={20} className={l.active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} /> 
              {l.label}
            </Link>
          ))}
          <div className="mt-auto py-4 border-t border-[var(--border-color)]">
            <button 
              onClick={handleLogout} 
              className="w-full p-3 rounded-[var(--radius-md)] border-none bg-transparent flex items-center gap-3 text-[0.85rem] font-bold text-[var(--brand-danger)] hover:bg-red-500/5 transition-all cursor-pointer"
            >
              <img src="https://img.icons8.com/fluency/256/exit.png" width={20} height={20} alt="خروج" /> تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:mr-[250px] p-6 md:p-12 transition-all">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-[1.8rem] font-black text-[var(--text-primary)] mb-2 flex items-center gap-3">
                  <img src="https://img.icons8.com/fluency/256/headset.png" width={32} height={32} alt="أيقونة الدعم" /> الدعم الفني
                </h1>
                <p className="text-[var(--text-secondary)] text-[0.9rem]">أرسل تذكرة وسيتم الرد خلال أقل من 24 ساعة</p>
              </div>
              <button className="btn-primary !px-8 !py-3 flex items-center gap-2.5 font-bold" onClick={() => setShowNewTicket(true)}>
                <img src="https://img.icons8.com/fluency/128/edit.png" width={20} height={20} className="brightness-0 invert" alt="أيقونة التحرير" /> تذكرة جديدة
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: 'تذاكر مفتوحة', value: tickets.filter(t => t.status === 'open').length, icon: 'https://img.icons8.com/fluency/256/feedback.png', color: 'var(--brand-accent)' },
                { label: 'مغلقة', value: tickets.filter(t => t.status === 'closed').length, icon: 'https://img.icons8.com/fluency/256/checkmark.png', color: 'var(--text-tertiary)' },
              ].map((s, i) => (
                <div key={i} className="card p-5 flex items-center gap-4 hover:translate-y-[-2px] transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center p-3">
                     <img src={s.icon} width={40} height={40} alt={s.label} />
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{s.label}</p>
                    <p className={`text-[1.8rem] font-black ${s.color === 'var(--brand-accent)' ? 'text-[var(--brand-accent)]' : 'text-[var(--text-tertiary)]'}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {(['all', 'open', 'closed'] as const).map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)} 
                  className={`px-5 py-2 rounded-full border-2 font-bold text-[0.85rem] transition-all whitespace-nowrap ${
                    filter === f 
                      ? 'bg-[var(--gradient-cta)] border-transparent text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]'
                  }`}
                >
                  {f === 'all' ? 'الكل' : statusConfig[f].label}
                </button>
              ))}
            </div>

            {/* Tickets List */}
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="card p-12 text-center text-[var(--text-secondary)] animate-pulse">جاري التحميل...</div>
              ) : filtered.length === 0 ? (
                <div className="card p-16 text-center space-y-4">
                  <img src="https://img.icons8.com/fluency/256/feedback.png" width={64} height={64} className="mx-auto opacity-30" alt="لا توجد بيانات" />
                  <p className="text-[var(--text-tertiary)] font-bold">لا توجد تذاكر دعم حالياً</p>
                </div>
              ) : filtered.map(ticket => {
                const sc = statusConfig[ticket.status as TicketStatus] || statusConfig.open;
                const isOpen = selectedTicket === ticket.id;
                return (
                  <div 
                    key={ticket.id} 
                    className={`card transition-all duration-300 overflow-hidden ${
                      isOpen ? 'border-[var(--brand-primary)] shadow-xl' : 'hover:border-[var(--brand-primary-light)] hover:-translate-y-0.5'
                    }`}
                  >
                    <div 
                      className="p-5 cursor-pointer flex justify-between items-center"
                      onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="text-[0.75rem] font-bold text-[var(--brand-primary)] uppercase">تذكرة #{ticket.id}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold ${sc.bgClass} ${sc.colorClass}`}>{sc.label}</span>
                        </div>
                        <h3 className="text-[1rem] font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand-primary)]">{ticket.subject}</h3>
                      </div>
                      <div className="text-left flex flex-col items-end gap-1">
                        <p className="text-[0.7rem] text-[var(--text-tertiary)] font-medium" dir="ltr">{new Date(ticket.createdAt).toLocaleString('ar-SA')}</p>
                        <img 
                          src="https://img.icons8.com/fluency/256/chevron-down.png" 
                          width={16} height={16} 
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          alt="أيقونة التوسيع"
                        />
                      </div>
                    </div>

                    {isOpen && (
                      <div className="p-5 pt-0 animate-fade-in">
                        <div className="border-t border-[var(--border-color)] pt-5 flex flex-col gap-4">
                          {/* Messages Thread */}
                          <div id="user-chat-container" className="flex flex-col gap-4 max-h-[400px] overflow-y-auto p-2">
                             {/* Original Message */}
                             <div className="flex flex-col items-start max-w-[90%]">
                                <div className="p-4 rounded-2xl rounded-tr-none bg-[var(--bg-card)] border border-[var(--border-color)] text-[0.9rem] text-[var(--text-primary)]">
                                   {ticket.message?.split('[MSG_')[0]}
                                </div>
                                <span className="text-[0.6rem] text-[var(--text-tertiary)] mt-1 px-2">{new Date(ticket.createdAt).toLocaleString('ar-SA')}</span>
                             </div>

                             {messages.map((m) => (
                               <div key={m.id} className={`flex flex-col ${m.role === 'ADMIN' ? 'items-end' : 'items-start'} max-w-[90%] ${m.role === 'ADMIN' ? 'mr-auto' : ''}`}>
                                  <div className={`p-4 rounded-2xl ${m.role === 'ADMIN' ? 'rounded-tl-none bg-[#0070f3] text-white shadow-md' : 'rounded-tr-none bg-black border border-[var(--border-color)] text-white'} text-[0.9rem]`}>
                                     {m.message}
                                  </div>
                                  <span className="text-[0.6rem] text-[var(--text-tertiary)] mt-1 px-2 font-bold">
                                     {m.role === 'ADMIN' ? 'المطور 👨‍💻' : 'أنت'} • {new Date(m.createdAt).toLocaleString('ar-SA')}
                                  </span>
                               </div>
                             ))}
                          </div>

                          {/* Reply Box */}
                          {ticket.status === 'open' ? (
                            <form onSubmit={handleReply} className="flex gap-2 mt-4">
                               <input 
                                 type="text" 
                                 placeholder="اكتب ردك هنا..."
                                 className="input-field flex-1 !py-3 !bg-[var(--bg-secondary)]" 
                                 value={reply}
                                 onChange={(e) => setReply(e.target.value)}
                                 disabled={sending}
                               />
                               <button 
                                 type="submit" 
                                 disabled={sending || !reply.trim()}
                                 className="btn-primary !px-5 !py-3 flex items-center justify-center disabled:opacity-50"
                               >
                                 {sending ? (
                                   <img src="https://img.icons8.com/fluency/48/hourglass.png" width={22} height={22} className="animate-spin brightness-0 invert" alt="انتظار" />
                                 ) : (
                                   <img src="https://img.icons8.com/fluency/48/sent.png" width={22} height={22} className="brightness-0 invert" alt="إرسال" />
                                 )}
                               </button>
                            </form>
                          ) : (
                            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl text-center text-[var(--text-tertiary)] text-[0.85rem] font-bold">
                               تم إغلاق هذه التذكرة. إذا كان لديك استفسار آخر يرجى فتح تذكرة جديدة.
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
        <div className="popup-overlay fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowNewTicket(false)}>
          <div 
            className="card animate-fade-in-up p-10 max-w-[550px] w-[90%] relative shadow-2xl overflow-hidden" 
            onClick={e => e.stopPropagation()} 
            dir="rtl"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--gradient-primary)]" />
            <h2 className="text-[1.5rem] font-black text-[var(--text-primary)] mb-2 flex items-center gap-3">
              <img src="https://img.icons8.com/fluency/128/edit.png" width={28} height={28} alt="تذكرة" /> تذكرة دعم جديدة
            </h2>
            <p className="text-[var(--text-secondary)] text-[0.9rem] mb-8">اكتب تفاصيل مشكلتك وسيقوم فريقنا بمساعدتك خلال ساعات.</p>
            
            {submitObj.error && (
               <div className="p-4 bg-red-500/10 text-[var(--brand-danger)] rounded-[var(--radius-md)] text-[0.85rem] font-bold mb-6 border border-red-500/20 flex items-center gap-3 animate-fade-in">
                  <img src="https://img.icons8.com/fluency/256/error.png" width={22} height={22} alt="خطأ" /> {submitObj.error}
               </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label htmlFor="subject-select" className="text-[0.85rem] font-bold text-[var(--text-secondary)]">بخصوص ماذا تحتاج المساعدة؟</label>
                <select 
                  id="subject-select"
                  className="input-field !py-3 font-bold !bg-[var(--bg-secondary)]" 
                  value={subject} 
                  onChange={e => {
                    const val = e.target.value;
                    setSubject(val);
                    if (!(val.includes('تعويض') || val.includes('إلغاء') || val.includes('مشكلة في طلب') || val.includes('Refill') || val.includes('Cancel'))) {
                      setOrderId('');
                    }
                  }}
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {(subject.includes('تعويض') || subject.includes('إلغاء') || subject.includes('مشكلة في طلب')) && (
                 <div className="animate-fade-in space-y-2">
                   <label htmlFor="order-id-input" className="text-[0.85rem] font-bold text-[var(--brand-accent)] flex items-center gap-2">
                     رقم الطلب (يجب أن يكون صحيحاً) <img src="https://img.icons8.com/fluency/256/search.png" width={16} height={16} alt="بحث" />
                   </label>
                   <input 
                      id="order-id-input"
                      className="input-field !py-3 !font-mono !text-center text-[1.1rem] !bg-[var(--bg-secondary)]" 
                      value={orderId} 
                      onChange={e => setOrderId(e.target.value)} 
                      placeholder="#12345" 
                      dir="ltr" 
                      required 
                   />
                 </div>
              )}

              <div className="space-y-2">
                <label htmlFor="message-textarea" className="text-[0.85rem] font-bold text-[var(--text-secondary)]">اشرح لنا التفاصيل</label>
                <textarea 
                  id="message-textarea"
                  className="input-field !py-4 min-h-[140px] !bg-[var(--bg-secondary)] resize-none" 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  required 
                  rows={4} 
                  placeholder="كيف يمكننا خدمتك اليوم؟..." 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={submitObj.loading} 
                  className="btn-primary flex-1 !py-4 !rounded-xl flex items-center justify-center gap-3 font-black shadow-lg shadow-purple-500/20"
                >
                  {submitObj.loading ? (
                    <>
                      <img src="https://img.icons8.com/fluency/256/hourglass.png" width={22} height={22} className="animate-spin brightness-0 invert" alt="انتظار" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <img src="https://img.icons8.com/fluency/256/sent.png" width={22} height={22} className="brightness-0 invert" alt="إرسال" />
                      إرسال التذكرة
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1 !py-4 !rounded-xl !bg-[var(--bg-secondary)] !border-none font-bold text-[var(--text-secondary)]" 
                  onClick={() => setShowNewTicket(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
