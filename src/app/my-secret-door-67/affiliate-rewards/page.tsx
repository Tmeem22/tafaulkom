"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { showToast } from '@/hooks/useNotification';

export default function AffiliateRewardsAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rewarding, setRewarding] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/affiliate-rewards')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => showToast('فشل تحميل البيانات', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleReward = async (userId: string, amount: number, rank: number, username: string) => {
    if (!confirm(`هل تريد تحويل $${amount} لـ ${username} (المركز ${rank})؟`)) return;
    setRewarding(userId);
    try {
      const res = await fetch('/api/admin/affiliate-rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, rank })
      });
      const result = await res.json();
      if (res.ok) {
        showToast(`✅ تم تحويل $${amount} لـ ${username} بنجاح!`, 'success');
        // Mark as rewarded in UI
        setData((prev: any) => ({
          ...prev,
          top5: prev.top5.map((t: any) => t.userId === userId ? { ...t, rewarded: true } : t)
        }));
      } else {
        showToast(result.error, 'error');
      }
    } catch (e) {
      showToast('حدث خطأ', 'error');
    } finally {
      setRewarding(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
          <div className="text-center">
            <img src="https://img.icons8.com/fluency/256/loading.png" width={40} className="animate-spin mx-auto mb-4" alt="loading" />
            <p className="font-bold text-[var(--text-secondary)]">جاري تحميل بيانات المسابقة...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div dir="rtl" className="min-h-screen pt-[90px] bg-[var(--bg-secondary)] p-4 md:p-10">
        <div className="max-w-[900px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-[2rem] md:text-[2.5rem] font-black text-[var(--text-primary)] flex items-center justify-center gap-3">
              🏆 مسابقة أفضل مسوّق - {data?.month} {data?.year}
            </h1>
            <p className="text-[var(--text-secondary)] font-bold mt-2">كافئ أفضل 5 مسوقين بالعمولة لهذا الشهر</p>
          </div>

          {/* Top 5 Cards */}
          <div className="space-y-4">
            {data?.top5?.length > 0 ? (
              data.top5.map((user: any, i: number) => {
                const rankEmojis = ['🥇', '🥈', '🥉', '🏅', '⭐'];
                const rankGradients = [
                  'from-amber-500/20 to-yellow-500/10 border-amber-400',
                  'from-slate-300/20 to-slate-400/10 border-slate-400',
                  'from-amber-700/20 to-amber-800/10 border-amber-700',
                  'from-blue-400/10 to-blue-500/5 border-blue-300',
                  'from-purple-400/10 to-purple-500/5 border-purple-300',
                ];
                
                return (
                  <div key={user.userId} className={`card p-6 md:p-8 rounded-[24px] bg-gradient-to-l ${rankGradients[i]} border-2 transition-all hover:shadow-xl`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-5">
                        <div className="text-[2.5rem]">{rankEmojis[i]}</div>
                        <div>
                          <p className="font-black text-[1.3rem] text-[var(--text-primary)]">
                            {user.title} - {user.username}
                          </p>
                          <p className="text-[0.8rem] text-[var(--text-secondary)] font-bold mt-1">
                            {user.email} • رصيد حالي: ${user.currentBalance.toFixed(2)}
                          </p>
                          <div className="flex gap-6 mt-2">
                            <span className="text-[0.75rem] font-black text-emerald-500">
                              💰 عمولة الشهر: ${user.monthlyCommission.toFixed(4)}
                            </span>
                            <span className="text-[0.75rem] font-bold text-[var(--text-secondary)]">
                              📦 {user.monthlyOrders} طلب عمولة
                            </span>
                            <span className="text-[0.75rem] font-bold text-[var(--text-secondary)]">
                              👥 {user.totalReferrals} إحالة
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-[0.7rem] font-bold text-[var(--text-tertiary)]">الجائزة</p>
                          <p className="text-[1.8rem] font-black text-amber-500">${user.prize}</p>
                        </div>
                        
                        {user.rewarded ? (
                          <div className="px-6 py-3 bg-emerald-500/10 rounded-2xl text-emerald-500 font-black text-[0.9rem] flex items-center gap-2">
                            ✅ تم التحويل
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReward(user.userId, user.prize, user.rank, user.username)}
                            disabled={rewarding === user.userId}
                            className="px-6 py-3 bg-emerald-500 text-white font-black rounded-2xl hover:brightness-110 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            {rewarding === user.userId ? (
                              <>جاري التحويل...</>
                            ) : (
                              <>💸 حوّل ${user.prize}</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card p-12 rounded-[24px] text-center">
                <img src="https://img.icons8.com/fluency/256/trophy.png" width={70} height={70} className="mx-auto mb-6 opacity-30" alt="empty" />
                <h3 className="text-[1.3rem] font-black text-[var(--text-tertiary)]">لا يوجد مسوقون بعد هذا الشهر</h3>
                <p className="text-[var(--text-tertiary)] mt-2 max-w-md mx-auto">سيظهر هنا أفضل 5 مسوقين عندما يبدأ المستخدمون بمشاركة روابط الإحالة وكسب العمولات.</p>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="card p-6 rounded-[24px] bg-gradient-to-l from-blue-500/5 to-transparent border border-blue-500/10">
            <h3 className="font-black text-[1rem] text-[var(--text-primary)] mb-3 flex items-center gap-2">
              📌 ملاحظات هامة
            </h3>
            <ul className="space-y-2 text-[0.85rem] text-[var(--text-secondary)]">
              <li className="flex items-start gap-2"><span className="text-blue-500 font-black">•</span> الجوائز تُحوّل كرصيد للمستخدم مباشرة</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-black">•</span> يصل المستخدم إشعار فوري بالفوز مع لقبه ومبلغ الجائزة</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-black">•</span> يُنصح بتحويل الجوائز في نهاية كل شهر ميلادي</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-black">•</span> الترتيب يعتمد على إجمالي العمولات المكتسبة خلال الشهر الحالي</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
