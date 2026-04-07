"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CURRENCY_SYMBOL } from '@/lib/constants';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png', active: true },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'API', href: '/api-docs', icon: 'https://img.icons8.com/fluency/256/code.png' },
];

type OrderStatus = 'all' | 'completed' | 'pending' | 'processing' | 'cancelled';

const statusConfig = {
  completed: { label: 'مكتمل', color: 'var(--brand-success)', bg: 'rgba(16,185,129,0.1)', icon: 'https://img.icons8.com/fluency/256/checkmark.png' },
  processing: { label: 'قيد التنفيذ', color: 'var(--brand-primary)', bg: 'rgba(108,60,225,0.1)', icon: 'https://img.icons8.com/fluency/256/spinner-frame-2.png' },
  pending: { label: 'معلّق', color: 'var(--brand-accent)', bg: 'rgba(245,158,11,0.1)', icon: 'https://img.icons8.com/fluency/256/hourglass.png' },
  cancelled: { label: 'ملغي', color: 'var(--brand-danger)', bg: 'rgba(239,68,68,0.1)', icon: 'https://img.icons8.com/fluency/256/delete-sign.png' },
};

export default function Orders() {
  const [filter, setFilter] = useState<OrderStatus>('all');
  const [searchId, setSearchId] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Rating Modal State
  const [ratingOrder, setRatingOrder] = useState<any>(null);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchOrdersAndUser();
  }, []);

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

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (searchId && !o.id.toString().includes(searchId)) return false;
    return true;
  });

  const counts = {
    all: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    pending: orders.filter(o => o.status === 'pending').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const handleAction = async (orderId: number, action: 'refill' | 'cancel') => {
    alert(`${action === 'refill' ? 'طلب تعويض' : 'طلب إلغاء'} للطلب #${orderId}`);
  };

  const submitRating = async () => {
    if (!ratingOrder) return;
    setSubmittingRating(true);
    try {
      const res = await fetch('/api/orders/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: ratingOrder.id,
          rating: selectedStars,
          review: reviewText
        })
      });
      if (res.ok) {
        alert('تم إرسال تقييمك بنجاح! شكراً لك.');
        setRatingOrder(null);
        setSelectedStars(5);
        setReviewText('');
        fetchOrdersAndUser(); // Refresh list
      }
    } catch (err) {
      alert('فشل في إرسال التقييم. يرجى المحاولة لاحقاً.');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        {/* Sidebar */}
        <aside className="w-[240px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 px-4 flex flex-col gap-1 fixed top-[70px] bottom-0 overflow-y-auto z-10 hidden lg:flex">
          <div className="p-6 px-5 bg-[var(--gradient-primary)] rounded-[24px] mb-6 text-center shadow-[var(--shadow-md)]">
            <p className="text-white/85 text-[0.75rem] font-bold uppercase tracking-wider mb-2">رصيدك الحالي</p>
            <p className="text-white text-[2rem] font-black mb-3 drop-shadow-md" dir="ltr">{balance !== null ? balance.toFixed(2) : '...'} {CURRENCY_SYMBOL}</p>
            <Link href="/dashboard/deposit" className="flex items-center justify-center gap-2 p-3 rounded-[15px] bg-white/20 text-white text-[0.85rem] font-extrabold no-underline transition-all hover:scale-[1.02] backdrop-blur-sm">
              <img src="https://img.icons8.com/fluency/256/plus.png" width={16} height={16} className="brightness-0 invert" alt="شحن رصيد" /> شحن رصيدك
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {sideLinks.map((link, i) => (
              <Link key={i} href={link.href} className={`p-3.5 px-5 rounded-[14px] no-underline flex items-center gap-4 text-[0.9rem] font-bold transition-all duration-300 ${
                link.active ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}>
                <img src={link.icon} alt={link.label} width={22} height={22} className={link.active ? 'opacity-100' : 'opacity-70'} /> {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto py-4 border-t border-[var(--border-color)]">
            <button 
              onClick={async () => {
                const res = await fetch('/api/auth/logout', { method: 'POST' });
                if (res.ok) window.location.href = '/';
              }}
              className="w-full bg-transparent border-none p-3.5 px-5 rounded-[14px] no-underline flex items-center gap-4 text-[0.9rem] font-bold text-[var(--brand-danger)] cursor-pointer transition-all hover:bg-red-500/10"
            >
              <img src="https://img.icons8.com/fluency/256/exit.png" width={22} height={22} alt="تسجيل الخروج" /> تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:mr-[240px] p-10 px-4 md:px-14">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-10 text-center md:text-right">
              <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] mb-2 tracking-tight flex items-center justify-center md:justify-start gap-4">
                <img src="https://img.icons8.com/fluency/256/list.png" width={38} height={38} alt="طلباتي" /> طلباتي
              </h1>
              <p className="text-[var(--text-secondary)] text-[0.95rem] font-semibold">سجل جميع الطلبات السابقة والحالية وحالاتها</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                {(['all', 'completed', 'processing', 'pending', 'cancelled'] as OrderStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-[14px] text-[0.85rem] font-extrabold transition-all border-2 ${
                      filter === status 
                        ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white shadow-[0_5px_15px_rgba(108,60,225,0.3)]' 
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/30'
                    }`}
                  >
                    {status === 'all' ? 'الكل' : statusConfig[status].label}
                    <span className={`mr-2 px-2 py-0.5 rounded-full text-[0.7rem] ${filter === status ? 'bg-white/20 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'}`}>
                      {counts[status]}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:w-[320px]">
                <img src="https://img.icons8.com/fluency/256/search.png" width={18} height={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50" alt="بحث" />
                <input
                  type="text"
                  className="input-field pr-12 h-[48px] rounded-[14px] text-[0.9rem] font-semibold"
                  placeholder="ابحث برقم الطلب..."
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="card rounded-[24px] overflow-hidden shadow-[var(--shadow-md)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                      <th className="p-5 text-right text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الطلب</th>
                      <th className="p-5 text-right text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الخدمة</th>
                      <th className="p-5 text-right text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الرابط</th>
                      <th className="p-5 text-center text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الكمية</th>
                      <th className="p-5 text-center text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">التكلفة</th>
                      <th className="p-5 text-center text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الحالة</th>
                      <th className="p-5 text-center text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الإجراءات</th>
                      <th className="p-5 text-center text-[0.75rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="p-20 text-center">
                          <img src="https://img.icons8.com/fluency/256/hourglass.png" width={48} height={48} className="animate-spin mx-auto mb-4 opacity-50" alt="تحميل" />
                          <p className="text-[var(--text-tertiary)] font-bold">جاري جلب طلباتك المسجلة...</p>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-20 text-center">
                          <img src="https://img.icons8.com/fluency/256/nothing-found.png" width={64} height={64} className="mx-auto mb-4 opacity-30" alt="لا يوجد" />
                          <p className="text-[var(--text-tertiary)] font-bold">لا توجد طلبات تطابق معايير البحث</p>
                        </td>
                      </tr>
                    ) : filtered.map(order => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig] || statusConfig['pending'];
                      return (
                        <tr key={order.id} className="transition-all hover:bg-[var(--bg-secondary)]/50">
                          <td className="p-5 text-[0.85rem] font-black text-[var(--brand-primary)]">#{order.id}</td>
                          <td className="p-5">
                            <span className="text-[0.85rem] font-bold text-[var(--text-primary)] block max-w-[200px] truncate" title={order.service}>{order.service}</span>
                          </td>
                          <td className="p-5">
                            <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-[0.8rem] text-[var(--brand-primary)] font-bold no-underline hover:underline block max-w-[150px] truncate" dir="ltr">
                              {order.link}
                            </a>
                          </td>
                          <td className="p-5 text-center text-[0.85rem] font-bold text-[var(--text-secondary)]">{order.quantity.toLocaleString()}</td>
                          <td className="p-5 text-center text-[0.85rem] font-black text-[var(--text-primary)]" dir="ltr">{order.charge.toFixed(4)} {CURRENCY_SYMBOL}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-[0.7rem] font-black flex items-center justify-center gap-2 mx-auto w-fit ${
                              order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                              order.status === 'processing' ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' :
                              order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'processing' ? 'animate-pulse' : ''} ${
                                order.status === 'completed' ? 'bg-emerald-500' :
                                order.status === 'processing' ? 'bg-[var(--brand-primary)]' :
                                order.status === 'pending' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}></span>
                              {sc.label}
                            </span>
                          </td>
                          <td className="p-5 text-center">
                            <div className="flex justify-center gap-2">
                              {/* Rate Button */}
                              {order.status === 'completed' && !order.rating && (
                                <button 
                                  onClick={() => setRatingOrder(order)} 
                                  className="p-2 rounded-[10px] bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all border-none cursor-pointer" 
                                  title="قيم الطلب"
                                >
                                  <img src="https://img.icons8.com/fluency/256/star.png" width={16} height={16} alt="Rate" />
                                </button>
                              )}
                              
                              {order.status === 'completed' && order.rating && (
                                <span className="flex gap-0.5" title={`تقييمك: ${order.rating} نجوم`}>
                                  {[1,2,3,4,5].map(s => (
                                    <img key={s} src="https://img.icons8.com/fluency/256/star.png" width={10} height={10} className={s > order.rating ? 'grayscale opacity-30' : ''} alt="star" />
                                  ))}
                                </span>
                              )}

                              {order.status === 'completed' && order.refill && (
                                <button onClick={() => handleAction(order.id, 'refill')} className="p-2 rounded-[10px] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border-none cursor-pointer" title="طلب تعويض">
                                  <img src="https://img.icons8.com/fluency/256/rotate.png" width={16} height={16} alt="Refill" />
                                </button>
                              )}
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button onClick={() => handleAction(order.id, 'cancel')} className="p-2 rounded-[10px] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer" title="إلغاء الطلب">
                                  <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={16} height={16} alt="Cancel" />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-5 text-center text-[0.75rem] font-bold text-[var(--text-tertiary)] whitespace-nowrap" dir="ltr">
                            {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {ratingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-card)] w-full max-w-[480px] rounded-[32px] border border-[var(--border-color)] overflow-hidden shadow-[var(--shadow-lg)] animate-scale-up">
              <div className="p-8 pb-4 flex justify-between items-center">
                <h3 className="text-[1.5rem] font-black text-[var(--text-primary)] tracking-tight">ما هو رأيك في الخدمة؟</h3>
                <button onClick={() => setRatingOrder(null)} className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border-none cursor-pointer hover:bg-red-500/10 group">
                  <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={20} height={20} className="group-hover:rotate-90 transition-all" alt="إغلاق" />
                </button>
              </div>
              <div className="p-8 pt-0 text-center">
                <p className="text-[0.95rem] text-[var(--text-secondary)] mb-8 font-medium italic">#{ratingOrder.id} - {ratingOrder.service}</p>
                
                <div className="flex justify-center gap-3 mb-10">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setSelectedStars(star)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-none ${
                        star <= selectedStars ? 'bg-amber-500/20 scale-110 shadow-lg' : 'bg-[var(--bg-secondary)] opacity-40 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src="https://img.icons8.com/fluency/256/star.png" 
                        width={star <= selectedStars ? 36 : 28} 
                        height={star <= selectedStars ? 36 : 28} 
                        className={star <= selectedStars ? '' : 'grayscale'}
                        alt="star" 
                      />
                    </button>
                  ))}
                </div>

                <div className="text-right mb-8">
                  <label className="block text-[0.85rem] font-black text-[var(--text-secondary)] mb-3 mr-1">اكتب تعليقك (اختياري)</label>
                  <textarea 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="input-field w-full h-[120px] p-5 rounded-[20px] resize-none text-[0.95rem] font-bold"
                    placeholder="رأيك يهمنا ويساعد الآخرين..."
                  ></textarea>
                </div>

                <button 
                  onClick={submitRating}
                  disabled={submittingRating}
                  className="w-full py-5 bg-[var(--brand-primary)] text-white font-black text-[1.1rem] rounded-[22px] border-none shadow-[0_10px_25px_rgba(108,60,225,0.4)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submittingRating ? (
                    <img src="https://img.icons8.com/fluency/256/spinner-frame-2.png" width={24} height={24} className="animate-spin brightness-0 invert" alt="loading" />
                  ) : 'إرسال التقييم الحين'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scale-up { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
        
        @media (max-width: 1024px) {
          aside { display: none !important; }
          .lg\\:mr-\\[240px\\] { margin-right: 0 !important; }
        }
      `}</style>
    </>
  );
}
