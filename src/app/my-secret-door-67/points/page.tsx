"use client";
import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AdminPoints() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [manualAmount, setManualAmount] = useState(250);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/points-tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      showToast('فشل تحميل الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
     if (!searchUsername) return;
     const res = await fetch(`/api/admin/users/points?username=${searchUsername}`);
     const data = await res.json();
     setUsers(data);
  };

  const handleManualPoints = async (userId: string, action: 'ADD' | 'REMOVE') => {
     try {
        const res = await fetch('/api/admin/users/points', {
           method: 'PATCH',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ userId, pointsAction: action, amount: manualAmount })
        });
        if (res.ok) {
           showToast('تم تحديث نقاط المستخدم بنجاح', 'success');
           searchUsers(); // Refresh list
        }
     } catch (e) {
        showToast('خطأ في العملية', 'error');
     }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAction = async (taskId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/admin/points-tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action })
      });
      if (res.ok) {
        showToast(action === 'APPROVE' ? 'تم القبول ومنح النقاط!' : 'تم الرفض', 'success');
        fetchTasks();
      }
    } catch (e) {
      showToast('حدث خطأ', 'error');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
              <h1 className="text-[2.2rem] font-black tracking-tight">إدارة التوكن والمكافآت 💎</h1>
              <p className="text-white/40 font-bold">تحكم كامل في نقاط المستخدمين ومراجعة الطلبات</p>
           </div>
           <button onClick={() => window.location.href = '/dashboard'} className="btn-secondary p-3 px-6 rounded-xl font-black">العودة للرئيسية</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
           
           {/* Section 1: Video Requests */}
           <div className="space-y-6">
              <h2 className="text-[1.3rem] font-black border-r-4 border-amber-500 pr-4">طلبات الفيديوهات (الانتظار)</h2>
              <div className="grid gap-4">
                {tasks.length === 0 ? (
                  <div className="bg-white/5 p-12 text-center rounded-[2rem] border border-white/5">لا توجد طلبات معلقة حالياً</div>
                ) : (
                  tasks.map((t) => (
                    <div key={t.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="font-black text-[1.1rem] leading-none mb-1">{t.user.username}</p>
                            <p className="text-[0.7rem] text-white/40">{new Date(t.createdAt).toLocaleString('ar-EG')}</p>
                         </div>
                         <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg text-[0.7rem] font-black">250 نقطة</div>
                      </div>
                      
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 break-all">
                         <p className="text-[0.7rem] text-white/40 mb-2 font-bold uppercase tracking-widest">المحتوى المرسل:</p>
                         <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:underline" dir="ltr">
                           {t.videoUrl}
                         </a>
                      </div>

                      {t.status === 'PENDING' ? (
                        <div className="flex gap-3">
                           <button onClick={() => handleAction(t.id, 'APPROVE')} className="flex-1 bg-emerald-600 p-4 rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all">موافقة ومنح النقاط ✅</button>
                           <button onClick={() => handleAction(t.id, 'REJECT')} className="bg-red-600 p-4 px-8 rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all">رفض</button>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-xl text-center font-black ${t.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                           {t.status === 'APPROVED' ? 'تمت الموافقة وتم منح النقاط بنجاح ✨' : 'تم رفض هذا الطلب'}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
           </div>

           {/* Section 2: Manual Control */}
           <div className="space-y-6">
              <h2 className="text-[1.3rem] font-black border-r-4 border-blue-500 pr-4">إضافة/سحب يدوي ⚙️</h2>
              <div className="card p-6 bg-white/5 border-white/5 space-y-6">
                 <div>
                    <label className="text-[0.8rem] font-black text-white/40 block mb-2">ابحث عن مستخدم (الاسم):</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={searchUsername}
                         onChange={e => setSearchUsername(e.target.value)}
                         className="flex-1 bg-white/10 p-3 rounded-xl outline-none font-bold" 
                         placeholder="tmeem..." 
                       />
                       <button onClick={searchUsers} className="bg-blue-600 p-3 px-5 rounded-xl font-black">بحث</button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {users.map(u => (
                       <div key={u.id} className="p-4 bg-black/20 rounded-xl border border-white/5">
                          <p className="font-black mb-3">{u.username}</p>
                          <div className="flex justify-between items-center mb-4">
                             <div className="text-center">
                                <p className="text-[0.6rem] text-white/40 font-bold">النقاط</p>
                                <p className="font-black text-amber-500">{u.points}</p>
                             </div>
                             <div className="text-center">
                                <p className="text-[0.6rem] text-white/40 font-bold">الرصيد</p>
                                <p className="font-black text-emerald-500">{u.balance.toFixed(2)}$</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <input 
                               id="manual-amount"
                               type="number" 
                               value={manualAmount}
                               onChange={e => setManualAmount(parseInt(e.target.value))}
                               className="w-20 bg-black/40 p-2 rounded-lg font-black text-center" 
                               aria-label="المبلغ اليدوي"
                               placeholder="250"
                             />
                             <button onClick={() => handleManualPoints(u.id, 'ADD')} className="flex-1 bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 p-2 rounded-lg font-black text-[0.7rem] hover:bg-emerald-600 hover:text-white">إضافة (+)</button>
                             <button onClick={() => handleManualPoints(u.id, 'REMOVE')} className="flex-1 bg-red-600/20 text-red-500 border border-red-500/30 p-2 rounded-lg font-black text-[0.7rem] hover:bg-red-600 hover:text-white">سحب (-)</button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10">
                 <h3 className="font-black text-amber-500 mb-2">تعليمات المطور 💡</h3>
                 <p className="text-[0.75rem] text-white/60 leading-relaxed font-bold">
                    - يمكنك استخدام زر البحث للعثور على أي مستخدم.<br/>
                    - التعديل اليدوي للنقاط يرسل إشعاراً فورياً للمستخدم.<br/>
                    - مراجعة الفيديوهات تمنح 250 نقطة تلقائياً عند الموافقة.
                 </p>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
