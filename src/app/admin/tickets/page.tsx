"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AdminTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

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

  const fetchMessages = async (ticketId: number) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => {
          const container = document.getElementById('admin-chat-container');
          if (container) container.scrollTop = container.scrollHeight;
        }, 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeTicket) return;

    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${activeTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      });

      if (res.ok) {
        setReply('');
        fetchMessages(activeTicket.id);
        showToast("تم إرسال الرد بنجاح", "success");
      } else {
        showToast("فشل إرسال الرد", "error");
      }
    } catch (error) {
      showToast("حدث خطأ في الاتصال", "error");
    } finally {
      setSending(false);
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
        if (activeTicket?.id === id) setActiveTicket(null);
      } else {
        showToast("حدث خطأ أثناء التحديث", "error");
      }
    } catch (error) {
      showToast("فشل الاتصال بالخادم", "error");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[50vh]">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[2rem] font-extrabold text-[var(--text-primary)] flex items-center gap-3">
          <img src="https://img.icons8.com/fluency/256/headset.png" width={40} height={40} alt="أيقونة الدعم الفني" /> تذاكر الدعم الفني
        </h1>
        <p className="text-[var(--text-secondary)]">الرد على استفسارات المستخدمين ومتابعة مشاكل الطلبات عبر نظام المحادثة المباشرة.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tickets List */}
        <div className={`flex flex-col gap-4 ${activeTicket ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          {tickets.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="mb-4 flex justify-center">
                <img src="https://img.icons8.com/fluency/256/mailbox-closed-flag-down.png" width={64} height={64} className="opacity-50" alt="لا توجد تذاكر" />
              </div>
              <h3 className="text-[var(--text-primary)]">لا توجد تذاكر دعم حالياً</h3>
            </div>
          ) : (
            tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => {
                  setActiveTicket(t);
                  fetchMessages(t.id);
                }}
                className={`card p-5 cursor-pointer transition-all border-r-4 ${
                  activeTicket?.id === t.id ? 'border-[var(--brand-primary)] bg-[var(--bg-secondary)] shadow-lg' : 'border-transparent hover:border-[var(--brand-primary-light)]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[0.95rem] font-bold text-[var(--text-primary)]">#{t.id} : {t.subject}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold ${t.status === 'open' ? 'bg-amber-500/10 text-[var(--brand-accent)]' : 'bg-emerald-500/10 text-[var(--brand-success)]'}`}>
                    {t.status === 'open' ? 'مفتوحة' : 'مغلقة'}
                  </span>
                </div>
                <p className="text-[0.8rem] text-[var(--text-secondary)] truncate mb-2">{t.message}</p>
                <div className="flex justify-between items-center text-[0.7rem] text-[var(--text-tertiary)]">
                  <span>{t.user?.username}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discussion View */}
        {activeTicket && (
          <div className="lg:col-span-7 flex flex-col h-[70vh] card sticky top-[100px] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                  <img src="https://img.icons8.com/fluency/48/user-male-circle.png" width={24} height={24} alt="مستخدم" />
                </div>
                <div>
                  <h4 className="text-[0.9rem] font-bold text-[var(--text-primary)]">{activeTicket.user?.username}</h4>
                  <p className="text-[0.7rem] text-[var(--text-tertiary)]">{activeTicket.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {activeTicket.status === 'open' && (
                  <button 
                    onClick={() => handleAction(activeTicket.id, 'close')}
                    className="p-2 rounded-lg bg-red-500/5 text-[var(--brand-danger)] hover:bg-red-500/10 transition-colors"
                    title="إغلاق التذكرة"
                  >
                    <img src="https://img.icons8.com/fluency/48/delete-sign.png" width={20} height={20} alt="إغلاق" />
                  </button>
                )}
                <button 
                  onClick={() => setActiveTicket(null)}
                  className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors"
                >
                  <img src="https://img.icons8.com/fluency/48/multiply.png" width={20} height={20} alt="إغلاق التفاصيل" />
                </button>
              </div>
            </div>

            <div id="admin-chat-container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[var(--bg-primary)]/30">
              {/* Original Message */}
              <div className="flex flex-col items-start max-w-[85%] animate-fade-in">
                <div className="p-4 rounded-2xl rounded-tr-none bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[0.9rem] text-[var(--text-primary)] shadow-sm">
                  {activeTicket.message?.split('[MSG_')[0]}
                </div>
                <span className="text-[0.65rem] text-[var(--text-tertiary)] mt-1 mr-2">{new Date(activeTicket.createdAt).toLocaleString('ar-SA')}</span>
              </div>

               {/* Messages Thread */}
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex flex-col ${m.role === 'ADMIN' ? 'items-end ml-auto' : 'items-start mr-auto'} max-w-[85%] animate-fade-in`}
                >
                  <div 
                    className={`p-4 rounded-2xl ${
                      m.role === 'ADMIN' 
                        ? 'rounded-tl-none bg-[#0070f3] text-white shadow-md' 
                        : 'rounded-tr-none bg-black border border-[var(--border-color)] text-white shadow-sm'
                    } text-[0.9rem]`}
                  >
                    {m.message}
                  </div>
                  <span className="text-[0.65rem] text-[var(--text-tertiary)] mt-1 px-2 font-bold">
                    {m.role === 'ADMIN' ? 'أنت (المطور)' : activeTicket.user?.username} • {new Date(m.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {activeTicket.status === 'open' ? (
              <form onSubmit={handleReply} className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-color)] flex gap-2">
                <input 
                  type="text" 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[var(--brand-primary)] transition-all"
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  disabled={sending || !reply.trim()}
                  className="bg-[var(--brand-primary)] text-white p-3 rounded-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {sending ? (
                    <img src="https://img.icons8.com/fluency/48/hourglass.png" width={24} height={24} className="animate-spin brightness-0 invert" alt="إرسال" />
                  ) : (
                    <img src="https://img.icons8.com/fluency/48/sent.png" width={24} height={24} className="brightness-0 invert" alt="إرسال" />
                  )}
                </button>
              </form>
            ) : (
              <div className="p-5 text-center bg-[var(--bg-secondary)] text-[var(--text-tertiary)] text-[0.8rem] font-bold">
                هذه التذكرة مغلقة ولا يمكن الرد عليها.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
