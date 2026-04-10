"use client";

import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    currentPassword: ''
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          setFormData(prev => ({ ...prev, username: data.user.username }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        setFormData(prev => ({ ...prev, password: '', currentPassword: '' }));
      } else {
        showToast(data.error, "error");
      }
    } catch (err) {
      showToast("حدث خطأ في الاتصال", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh] opacity-50">
      <img src="https://img.icons8.com/fluency/256/loading-heart.png" className="animate-pulse w-16" alt="Loading" />
    </div>
  );

  return (
    <div className="max-w-[800px] mx-auto animate-fade-in-up relative">
      
      {/* 🚀 Saudi Run-Away Motion Graphic */}
      {saving && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#05060f]/95 backdrop-blur-3xl animate-in fade-in duration-700">
           <div className="flex flex-col items-center gap-10 max-w-[440px] w-full text-center px-8">
              
              <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-[30px] border border-white/5 bg-gradient-to-t from-white/5 to-transparent shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                 {/* Parallax speed lines for depth */}
                 <div className="absolute inset-x-0 h-[300%] w-[1px] bg-white/10 left-1/4 animate-speed-line"></div>
                 <div className="absolute inset-x-0 h-[300%] w-[1px] bg-[var(--brand-primary)]/20 left-1/2 animate-speed-line" style={{ animationDelay: '0.3s' }}></div>
                 <div className="absolute inset-x-0 h-[300%] w-[1px] bg-white/10 left-3/4 animate-speed-line" style={{ animationDelay: '0.6s' }}></div>

                 <img 
                    src="/running_away.png" 
                    className="relative z-10 w-[320px] h-[320px] object-contain animate-run-away drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]" 
                    alt="جاري الانطلاق..." 
                 />
                 
                 {/* Portal Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--brand-primary)]/30 blur-[120px] rounded-full"></div>
              </div>

              <div className="space-y-4">
                 <h2 className="text-[2rem] font-black text-white tracking-tight">جاري معالجة طلبك.. 🚀</h2>
                 <p className="text-white/40 text-[1.1rem] font-bold">بطلنا في طريقه لتحديث بياناتك بأمان</p>
                 
                 <div className="flex justify-center gap-4 pt-4">
                    <div className="w-4 h-4 rounded-full bg-[var(--brand-primary)] animate-pulse shadow-[0_0_25px_var(--brand-primary)]"></div>
                    <div className="w-4 h-4 rounded-full bg-[var(--brand-primary)] animate-pulse shadow-[0_0_25px_var(--brand-primary)] animate-delay-200"></div>
                    <div className="w-4 h-4 rounded-full bg-[var(--brand-primary)] animate-pulse shadow-[0_0_25px_var(--brand-primary)] animate-delay-400"></div>
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* Top Header & Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-lg">
              <img src="https://img.icons8.com/papercut/256/user-male-circle.png" width={34} height={34} alt="Avatar" />
           </div>
           <div>
             <h1 className="text-[1.8rem] font-black text-[var(--text-primary)] leading-tight">إعدادات حسابي</h1>
             <p className="text-[var(--text-secondary)] text-[0.8rem] font-medium">التحكم في بياناتك الشخصية</p>
           </div>
        </div>
        <button 
           onClick={() => window.location.href = '/dashboard'}
           className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-3 text-[0.85rem] font-black hover:border-[var(--brand-primary)] transition-all"
        >
           <img src="https://img.icons8.com/fluency/256/back.png" width={18} height={18} alt="Back" />
           العودة للمتجر
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-8 shadow-lg border-[var(--border-color)] relative">
            <div className="flex flex-col gap-6">
              <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/checked-user-male.png" width={22} height={22} alt="user" />
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="username" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">اسم المستخدم</label>
                  <input 
                    id="username"
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="input-field h-14 rounded-2xl" 
                    placeholder="اسم المستخدم الجديد"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">البريد الإلكتروني (لا يمكن تغييره)</label>
                  <input 
                    id="email"
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    placeholder="بريدك الإلكتروني"
                    title="البريد الإلكتروني لا يمكن تغييره"
                    className="input-field h-14 rounded-2xl opacity-50 cursor-not-allowed bg-[var(--bg-secondary)]" 
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[var(--border-color)] w-full"></div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/lock.png" width={22} height={22} alt="security" />
                تغيير كلمة المرور
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="new-pass" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">كلمة المرور الجديدة</label>
                  <input 
                    id="new-pass"
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="input-field h-14 rounded-2xl" 
                    placeholder="اتركها فارغة إذا لا تريد التغيير"
                  />
                </div>
                {formData.password && (
                  <div>
                    <label htmlFor="curr-pass" className="block text-[0.8rem] font-black text-[var(--text-secondary)] mb-2 mr-1">كلمة المرور الحالية (للتأكيد)</label>
                    <input 
                      id="curr-pass"
                      type="password" 
                      value={formData.currentPassword}
                      onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="input-field h-14 rounded-2xl border-emerald-500/30 ring-emerald-500/10 focus:ring" 
                      placeholder="يجب إدخال كلمة المرور الحالية للحفظ"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary w-full py-5 rounded-2xl text-[1.1rem] font-black flex items-center justify-center gap-3 shadow-xl hover:shadow-[var(--brand-primary)]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <img src="https://img.icons8.com/fluency/256/save.png" width={24} height={24} className="brightness-0 invert" alt="save" /> 
              حفظ وتحديث البيانات
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card p-6 bg-[var(--bg-secondary)] border-none">
            <h4 className="text-[0.9rem] font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <img src="https://img.icons8.com/fluency/256/info.png" width={18} height={18} alt="info" />
              نبذة
            </h4>
            <div className="flex flex-col gap-4">
               <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)]">
                  <p className="text-[0.65rem] font-black text-[var(--text-secondary)] uppercase mb-1">الرصيد المتاح</p>
                  <p className="text-[1.2rem] font-black text-[var(--brand-primary)]" dir="ltr">${user?.balance?.toFixed(2) || '0.00'}</p>
               </div>
               <div className="px-1">
                  <p className="text-[0.7rem] font-bold text-[var(--text-secondary)] mb-1">تاريخ التسجيل</p>
                  <p className="text-[0.9rem] font-bold text-[var(--text-primary)]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '---'}</p>
               </div>
            </div>
          </div>

          <div className="card p-6 border-r-4 border-[var(--brand-primary)]">
             <h4 className="text-[0.85rem] font-black text-[var(--text-primary)] mb-2 leading-relaxed">أمان عالـي 🛡️</h4>
             <p className="text-[0.75rem] text-[var(--text-secondary)] leading-relaxed font-medium">
               يتم تشفير جميع كلمات المرور وفصلها عن بياناتك الشخصية لضمان أقصى حماية.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
