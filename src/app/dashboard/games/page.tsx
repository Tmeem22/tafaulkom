"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png', active: true },
  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png' },
];

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'REVERSE' | 'MYSTERY'>('HOME');
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customBid, setCustomBid] = useState('');

  useEffect(() => {
    fetch('/api/user/me').then(r => r.json()).then(setUser);
  }, []);

  useEffect(() => {
    if (activeTab === 'REVERSE') {
      const fetchDrops = async () => {
        const res = await fetch('/api/games/drops');
        const data = await res.json();
        setGame(data[0] || null);
      };
      fetchDrops();
      const int = setInterval(fetchDrops, 3000);
      return () => clearInterval(int);
    }
  }, [activeTab]);

  const buyBox = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/games/mystery-box', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(`🎉 مبروك! لقد حصلت على: ${data.item.name} وتم إضافتها للخزنة`, 'success');
        fetch('/api/user/me').then(r => r.json()).then(setUser);
      } else {
        showToast(data.error || "فشل الشراء", "error");
      }
    } catch (e) {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setLoading(false);
    }
  };

  const buyBundle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/games/mystery-box/buy-bundle', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(`🔥 تم فتح 5 صناديق بنجاح! راجع الخزنة والإشعارات لترى ما ربحت.`, 'success');
        fetch('/api/user/me').then(r => r.json()).then(setUser);
      } else {
        showToast(data.error || "فشل شراء الباقة", "error");
      }
    } catch (e) {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setLoading(false);
    }
  };

  const snatchDrop = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/games/snatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dropId: id })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('🎉 مبروك! لقد خطفت الباقة بنجاح! راجع الخزنة.', 'success');
        setGame(data.drop);
        fetch('/api/user/me').then(r => r.json()).then(setUser);
      } else {
        showToast(data.error || "فاتتك الفرصة، شخص آخر خطفها!", "error");
      }
    } catch (e) {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (id: string, amount: number) => {
    if (amount <= (game.highestBid || game.startPrice)) {
       return showToast("يجب أن تكون المزايدة أعلى من السعر الحالي", "error");
    }
    setLoading(true);
    try {
      const res = await fetch('/api/games/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId: id, bidAmount: amount })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('✅ تمت المزايدة بنجاح! أنت الآن في الصدارة.', 'success');
        setGame(data.auction);
        setCustomBid('');
        fetch('/api/user/me').then(r => r.json()).then(setUser);
      } else {
        showToast(data.error || "خطأ في المزايدة", "error");
      }
    } catch (e) {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        {/* Sidebar */}
        <aside className="w-[280px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-8 fixed top-[70px] bottom-0 overflow-y-auto hidden lg:flex flex-col gap-2">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-4 rounded-[20px] no-underline flex items-center justify-between gap-4 text-[0.85rem] font-black transition-all ${l.active ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <div className="flex items-center gap-4">
                <img src={l.icon} width={24} height={24} alt={l.label} className={l.active ? 'brightness-0 invert' : ''} />
                {l.label}
              </div>
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:mr-[280px] p-6 lg:p-12">
          <div className="max-w-[1100px] mx-auto">
            
            {activeTab === 'HOME' && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-14 relative p-12 rounded-[40px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
                  <h1 className="text-[3.5rem] font-black tracking-tight mb-4 relative z-10">صالة الألعاب والتحديات 🎮</h1>
                  <p className="text-white/80 font-bold text-xl relative z-10">العب، تفاعل، واكسب باقات ضخمة بأسعار خيالية وجوائز فورية!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="card group p-10 rounded-[40px] border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-red-500/50 transition-all cursor-pointer shadow-xl relative overflow-hidden" onClick={() => setActiveTab('REVERSE')}>
                     <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <img src="https://img.icons8.com/fluency/256/auction.png" width={100} height={100} alt="أيقونة المزاد" className="mb-8 group-hover:scale-110 transition-transform" />
                     <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                        حوش المزادات والتحديات
                        <span className="px-3 py-1 bg-red-500 text-white text-[0.65rem] rounded-full animate-pulse">مباشر</span>
                     </h2>
                     <p className="text-[var(--text-secondary)] font-bold mb-8">ادخل ساحة المنافسة على أقوى باقات SMM بأسعار تبدأ من صفر ريال أحياناً!</p>
                     <button className="w-full bg-red-500 text-white font-black py-4 rounded-[20px] shadow-lg shadow-red-500/20">دخول الساحة 🔥</button>
                  </div>

                  <div className="card group p-10 rounded-[40px] border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-purple-500/50 transition-all cursor-pointer shadow-xl relative overflow-hidden" onClick={() => setActiveTab('MYSTERY')}>
                     <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <img src="https://img.icons8.com/fluency/256/treasure-chest.png" width={100} height={100} alt="أيقونة الصندوق" className="mb-8 group-hover:scale-110 transition-transform" />
                     <h2 className="text-2xl font-black mb-4">صندوق الغموض السري</h2>
                     <p className="text-[var(--text-secondary)] font-bold mb-8">بـ 10 ريال فقط جرب حظك واربح هدايا تصل قيمتها إلى 200 ريال رصيد فوري!</p>
                     <button className="w-full bg-purple-500 text-white font-black py-4 rounded-[20px] shadow-lg shadow-purple-500/20">افتح الصناديق 🔑</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'REVERSE' && (
              <div className="animate-in slide-in-from-right-10 duration-500">
                <button onClick={() => setActiveTab('HOME')} className="mb-10 font-black text-[var(--brand-primary)] hover:translate-x-[-10px] transition-all flex items-center gap-3">
                   <span>➜</span> العودة للصالة الرئيسية
                </button>

                {!game ? (
                   <div className="card p-24 text-center rounded-[50px] border-2 border-dashed border-[var(--border-color)]">
                      <img src="https://img.icons8.com/fluency/256/hourglass.png" width={100} height={100} alt="ساعة الانتظار" className="mx-auto mb-8 opacity-40 animate-spin-slow" />
                      <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">لا توجد تحديات نشطة</h2>
                      <p className="text-[var(--text-secondary)] font-black text-lg">ترقب الإعلانات في تليجرام، الإدارة تطرح مزادات قوية يومياً!</p>
                   </div>
                ) : (
                   <div className="space-y-10">
                      {/* Auction Header Info */}
                      <div className="card p-10 rounded-[45px] border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl relative overflow-hidden">
                         <div className={`absolute top-0 right-0 p-4 px-8 font-black text-sm rounded-bl-3xl shadow-lg border-b border-l border-white/10 ${game.status === 'WAITING' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
                             {game.status === 'WAITING' ? 'قيد الانتظار ⏰' : 'المزاد نشط حالياً 🔥'}
                         </div>
                         
                         <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-32 h-32 bg-[var(--bg-secondary)] rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner">
                               <img src={game.type === 'REVERSE_AUCTION' ? 'https://img.icons8.com/fluency/512/lightning-bolt.png' : 'https://img.icons8.com/fluency/512/auction.png'} width={80} height={80} alt="نوع المزاد" />
                            </div>
                            <div>
                               <h1 className="text-3xl font-black text-[var(--text-primary)] mb-3">{game.title}</h1>
                               <p className="text-lg text-[var(--text-secondary)] font-bold max-w-2xl">{game.prizeDescription}</p>
                            </div>
                         </div>
                      </div>

                      {/* Common Prize UI for Waiting/Active */}
                      {game.status === 'WAITING' ? (
                          <div className="card p-16 text-center rounded-[45px] bg-amber-500/5 border-2 border-amber-500/30">
                             <h2 className="text-4xl font-black text-amber-600 mb-6">يبدأ المزاد خلال:</h2>
                             <div className="inline-block bg-white border border-amber-500/20 px-12 py-6 rounded-[35px] shadow-2xl">
                                <span className="text-5xl font-mono font-black text-amber-500">
                                   {new Date(game.startTime).toLocaleTimeString('ar-SA')}
                                </span>
                             </div>
                             <p className="mt-8 text-[var(--text-secondary)] font-black">كن مستعداً.. الكمية باقة واحدة فقط للفائز الأسرع!</p>
                          </div>
                      ) : game.status === 'ACTIVE' ? (
                         <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-10">
                            
                            {/* The Real Game Interface */}
                            <div className={`card p-12 rounded-[50px] border-4 flex flex-col items-center justify-center text-center shadow-3xl relative overflow-hidden ${game.type === 'REVERSE_AUCTION' ? 'border-red-500 shadow-red-500/20' : 'border-emerald-500 shadow-emerald-500/20'}`}>
                               <p className="text-[var(--text-tertiary)] font-black uppercase tracking-widest mb-4">
                                  {game.type === 'REVERSE_AUCTION' ? 'السعر الحالي يتناقص' : 'أعلى مزايدة حالياً'}
                               </p>
                               <div className="flex items-end gap-3 mb-10" dir="ltr">
                                  <span className={`text-[5.5rem] font-black leading-none ${game.type === 'REVERSE_AUCTION' ? 'text-red-600' : 'text-emerald-600'}`}>
                                     {(game.type === 'REVERSE_AUCTION' ? game.currentPrice : (game.highestBid || game.startPrice)).toFixed(2)}
                                  </span>
                                  <span className="text-2xl font-black text-[var(--text-secondary)] mb-4">ر.س</span>
                               </div>

                               {game.type === 'REVERSE_AUCTION' ? (
                                  <button 
                                    onClick={() => snatchDrop(game.id)}
                                    disabled={loading}
                                    className="w-full max-w-md py-8 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-3xl font-black rounded-[30px] shadow-2xl shadow-red-500/40 transition-all border-b-8 border-red-900"
                                  >
                                     {loading ? 'جاري الخطف...' : 'اخطف الباقة الآن! ⚡'}
                                  </button>
                               ) : (
                                  <div className="w-full space-y-6">
                                     <div className="grid grid-cols-3 gap-4">
                                        {[0.5, 5, 10].map(val => (
                                           <button 
                                             key={val}
                                             onClick={() => placeBid(game.id, (game.highestBid || game.startPrice) + val)}
                                             className="py-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 font-black rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"
                                           >+{val} ر.س</button>
                                        ))}
                                     </div>
                                     <div className="flex gap-4">
                                        <input 
                                          type="number" 
                                          placeholder="مبلغ مزايدة مخصص..." 
                                          className="flex-1 input-field py-4 text-center font-black"
                                          value={customBid}
                                          onChange={e => setCustomBid(e.target.value)}
                                        />
                                        <button 
                                          onClick={() => placeBid(game.id, Number(customBid))}
                                          className="px-10 bg-emerald-600 text-white font-black rounded-2xl shadow-lg"
                                        >مزايدة 🚀</button>
                                     </div>
                                     <p className="text-red-500 font-black text-sm pt-4 animate-pulse">
                                         ⏰ ينتهي المزاد في: {new Date(game.endTime).toLocaleTimeString('ar-SA')}
                                     </p>
                                  </div>
                               )}
                            </div>

                            {/* Sidebar Info for Active Game */}
                            <div className="space-y-6">
                               <div className="card p-8 rounded-[35px] bg-[var(--bg-card)] border border-[var(--border-color)]">
                                  <h4 className="font-black mb-4">قواعد التحدي:</h4>
                                  <ul className="space-y-3 text-sm font-bold text-[var(--text-secondary)]">
                                     {game.type === 'REVERSE_AUCTION' ? (
                                       <>
                                         <li className="flex gap-3"><span>🔻</span> السعر ينقص كل {game.dropIntervalSeconds} ثوانٍ.</li>
                                         <li className="flex gap-3"><span>🔻</span> أول شخص يضغط هو الفائز.</li>
                                       </>
                                     ) : (
                                       <>
                                         <li className="flex gap-3"><span>🔺</span> السعر يرتفع مع كل مزايدة جديدة.</li>
                                         <li className="flex gap-3"><span>🔺</span> إذا زايد أحد فوقك، يرجع رصيدك لك فوراً.</li>
                                         <li className="flex gap-3"><span>🔺</span> آخر شخص يزايد هو صاحب الباقة.</li>
                                       </>
                                     )}
                                  </ul>
                               </div>
                               <div className="card p-8 rounded-[35px] bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">💰</div>
                                     <div>
                                        <p className="text-[0.7rem] font-bold opacity-80">رصيدك الحالي:</p>
                                        <p className="text-xl font-black">{user?.balance?.toFixed(2)} ر.س</p>
                                     </div>
                                  </div>
                               </div>
                            </div>

                         </div>
                      ) : (
                         <div className="card p-16 text-center rounded-[50px] bg-emerald-500/10 border-2 border-emerald-500/40">
                            <img src="https://img.icons8.com/fluency/256/medal.png" width={100} height={100} alt="ميدالية الفوز" className="mx-auto mb-6" />
                            <h2 className="text-4xl font-black text-emerald-600 mb-2">تم حسم المزاد!</h2>
                            <p className="text-xl font-bold text-[var(--text-secondary)] mb-8">مبروك للفائز، الجائزة أصبحت في الخزنة كـ "برق" ⚡</p>
                            <Link href="/dashboard/inventory" className="btn-primary py-4 px-12 rounded-[22px] no-underline inline-block">اذهب لخزنتي</Link>
                         </div>
                      )}
                   </div>
                )}
              </div>
            )}

            {activeTab === 'MYSTERY' && (
              <div className="animate-in slide-in-from-right-10 duration-500">
                <button onClick={() => setActiveTab('HOME')} className="mb-10 font-black text-[var(--brand-primary)] hover:translate-x-[-10px] transition-all flex items-center gap-3">
                   <span>➜</span> العودة للصالة
                </button>

                <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-14">
                   {/* Info */}
                   <div>
                      <h1 className="text-4xl font-black text-purple-600 mb-6">صندوق الغموض العجيب 📦</h1>
                      <p className="text-lg font-bold text-[var(--text-secondary)] leading-loose mb-10">
                        جرب حظك الآن بـ 10 ريال فقط! كل صندوق يحتوي على مفاجأة، إما رصيد نقدي فوري أو باقة خدمات ضخمة تزيد من هيبة حساباتك.
                      </p>
                      
                      <div className="space-y-4">
                         {[
                            { name: 'رصيد يصل لـ 200 ر.س', color: 'amber' },
                            { name: '100,000 مشاهدة تيك توك', color: 'indigo' },
                            { name: 'خدمات VIP حصرية', color: 'purple' },
                            { name: 'استرداد قيمة الصندوق كاش', color: 'emerald' },
                         ].map((p, i) => (
                            <div key={i} className={`p-4 rounded-3xl border border-${p.color}-500/20 bg-${p.color}-500/5 flex items-center justify-between`}>
                               <span className={`font-black text-${p.color}-600`}>{p.name}</span>
                               <span className="text-[1.2rem]">🎁</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* The Chest */}
                   <div className="flex flex-col items-center">
                      <div className={`relative mb-12 transform transition-all duration-700 ${loading ? 'animate-bounce scale-110' : 'hover:scale-105'}`}>
                         <img src="https://img.icons8.com/fluency/512/treasure-chest.png" width={320} height={320} alt="صندوق الكنز" className="drop-shadow-[0_20px_50px_rgba(168,85,247,0.4)]" />
                         {loading && <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>}
                      </div>
                      
                      <div className="w-full space-y-6">
                         <div className="card p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center relative overflow-hidden group">
                            <p className="font-black text-[var(--text-tertiary)] mb-4">رصيدك: {user?.balance?.toFixed(2)} ر.س</p>
                            <button 
                                onClick={buyBox}
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-6 rounded-[25px] text-2xl shadow-xl shadow-purple-600/30 transition-all border-b-8 border-purple-900 active:translate-y-2 active:border-b-0"
                            >
                                {loading ? 'جاري الفتح...' : 'افتح صندوقاً (10 ر.س)'}
                            </button>
                         </div>

                         <div className="card p-8 rounded-[40px] bg-gradient-to-br from-amber-500 to-orange-600 text-white text-center relative overflow-hidden shadow-2xl scale-105">
                            <div className="absolute top-0 left-0 bg-white text-orange-600 px-4 py-1 font-black text-[0.6rem] rounded-br-2xl">الأكثر مبيعاً 🔥</div>
                            <h4 className="font-black text-xl mb-2">باقة 5 صناديق توفير</h4>
                            <p className="text-[0.8rem] font-bold opacity-90 mb-6">افتح 5 صناديق دفعة واحدة بـ 40 ريال بدلاً من 50!</p>
                            <button 
                                onClick={buyBundle}
                                disabled={loading}
                                className="w-full bg-white text-orange-600 hover:bg-gray-100 font-black py-5 rounded-[22px] text-xl transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'جاري المعالجة...' : 'شراء الباقة (40 ر.س)'}
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
