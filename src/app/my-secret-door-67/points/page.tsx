"use client";
import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AdminPoints() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/points-tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      showToast('فشل تحميل البيانات', 'error');
    } finally {
      setLoading(false);
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
    <div dir="rtl" className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8">إدارة طلبات النقاط (الفيديوهات)</h1>
        
        <div className="grid gap-6">
          {tasks.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl shadow-sm">لا توجد طلبات معلقة حالياً</div>
          ) : (
            tasks.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-black text-lg">{t.user.username}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">{new Date(t.createdAt).toLocaleString('ar-EG')}</span>
                  </div>
                  <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline break-all" dir="ltr">
                    {t.videoUrl}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  {t.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={() => handleAction(t.id, 'APPROVE')}
                        className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black hover:bg-emerald-600 transition-all"
                      >
                        قبول ومنح 250 نقطة
                      </button>
                      <button 
                        onClick={() => handleAction(t.id, 'REJECT')}
                        className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black hover:bg-red-600 transition-all"
                      >
                        رفض
                      </button>
                    </>
                  ) : (
                    <span className={`font-black px-4 py-2 rounded-xl ${t.status === 'APPROVED' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                      {t.status === 'APPROVED' ? 'تم القبول ✅' : 'تم الرفض ❌'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
