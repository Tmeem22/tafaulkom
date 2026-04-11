"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';

export default function AdminVideoTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/video-tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      showToast("فشلت عملية جلب طلبات النقاط", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAction = async (taskId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/admin/video-tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(action === 'APPROVE' ? "تم قبول الطلب وإضافة النقاط للمستخدم" : "تم رفض الطلب", "success");
        fetchTasks();
      } else {
        showToast(data.error || "فشل معالجة الطلب", "error");
      }
    } catch (err) {
      showToast("خطأ في الاتصال بالسيرفر", "error");
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
        <img src="https://img.icons8.com/fluency/256/hourglass.png" width={48} className="animate-spin opacity-50 mb-4" alt="loading" />
        <p className="font-bold text-[var(--text-tertiary)]">جاري جلب الطلبات...</p>
    </div>
  );

  return (
    <div className="animate-fade-in" dir="rtl">
       <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--text-primary)]">إدارة طلبات مقاطع الفيديو (النقاط)</h1>
          <p className="text-[var(--text-secondary)] font-medium">مراجعة الفيديوهات المرسلة من المستخدمين لمنحهم نقاط المكافأة.</p>
       </div>

       <div className="card rounded-[24px] overflow-hidden shadow-xl border border-[var(--border-color)]">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">معرف الطلب</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">المستخدم</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">رابط الفيديو المستلم</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">النقاط</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الحالة</th>
                  <th className="p-5 px-6 text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">التاريخ</th>
                  <th className="p-5 px-6 text-center text-[0.8rem] font-black text-[var(--text-secondary)] uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-[var(--border-color)] hover:bg-[var(--brand-primary)]/[0.02] transition-colors">
                    <td className="p-5 px-6 font-black text-[var(--brand-primary)] text-xs font-mono max-w-[100px] truncate" title={task.id}>
                        {task.id.slice(0, 8)}...
                    </td>
                    <td className="p-5 px-6">
                        <span className="font-bold text-[var(--text-primary)] block">{task.user?.username}</span>
                    </td>
                    <td className="p-5 px-6">
                        <div className="flex justify-start">
                           {task.videoUrl.includes('/uploads/') || task.videoUrl.endsWith('.mp4') ? (
                             <button
                               onClick={() => setPreviewVideo(task.videoUrl)}
                               className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl text-[0.8rem] font-black flex items-center gap-2 hover:bg-blue-500/20 active:scale-95 transition-all shadow-sm border-none cursor-pointer truncate max-w-[200px]"
                               title={task.videoUrl}
                             >
                                <img src="https://img.icons8.com/fluency/256/play.png" width={18} alt="Play" />
                                مشاهدة الفيديو المرفوع
                             </button>
                           ) : (
                             <Link href={task.videoUrl} target="_blank" className="text-[0.85rem] font-bold text-blue-500 hover:underline flex items-center gap-2 truncate max-w-[200px] text-left" dir="ltr" title={task.videoUrl}>
                                <img src="https://img.icons8.com/fluency/256/external-link.png" width={16} alt="Link" />
                                {task.videoUrl}
                             </Link>
                           )}
                        </div>
                    </td>
                    <td className="p-5 px-6">
                        <span className="text-[0.8rem] font-mono text-[var(--brand-primary)] font-bold bg-[var(--brand-primary)]/5 p-1 px-2 rounded-md">{task.points}</span>
                    </td>
                    <td className="p-5 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[0.7rem] font-black ${
                            task.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                            task.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                            'bg-amber-500/10 text-amber-500'
                        }`}>
                            {task.status === 'APPROVED' ? 'تم القبول' : task.status === 'REJECTED' ? 'مرفوض' : 'قيد الانتظار'}
                        </span>
                    </td>
                    <td className="p-5 px-6 text-[0.75rem] font-bold text-[var(--text-tertiary)]" dir="ltr">
                        {new Date(task.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-5 px-6 flex justify-center gap-2">
                      {task.status === 'PENDING' ? (
                        <>
                          <button 
                            onClick={() => handleAction(task.id, 'APPROVE')}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all border-none cursor-pointer"
                          >
                            قبول ومنح
                          </button>
                          <button 
                            onClick={() => handleAction(task.id, 'REJECT')}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all border-none cursor-pointer"
                          >
                            رفض
                          </button>
                        </>
                      ) : (
                        <span className="text-[0.75rem] font-bold text-[var(--text-tertiary)] italic">تمت المعالجة</span>
                      )}
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-20 text-center text-[var(--text-tertiary)] font-bold">لا توجد طلبات لفيديوهات حالياً.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
       </div>
      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setPreviewVideo(null)}>
           <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[24px] p-6 max-w-[800px] w-full shadow-2xl relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPreviewVideo(null)} className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/30 hover:scale-110 active:scale-95 transition-all outline-none border-2 border-white dark:border-[var(--bg-card)]">✕</button>
              <h3 className="text-[1.2rem] font-black mb-4 flex items-center gap-3">
                 <img src="https://img.icons8.com/fluency/256/play.png" width={28} alt="Play" />
                 معاينة الفيديو المرفوع
              </h3>
              <video src={previewVideo} controls autoPlay className="w-full rounded-xl bg-black max-h-[65vh] object-contain shadow-inner border border-white/10"></video>
           </div>
        </div>
      )}
    </div>
  );
}
