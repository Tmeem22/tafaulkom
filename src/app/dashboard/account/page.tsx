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
    <div className="max-w-[800px] mx-auto animate-fade-in-up">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 rounded-3xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-xl">
           <img src="https://img.icons8.com/papercut/256/user-male-circle.png" width={50} height={50} alt="Avatar" />
        </div>
        <div>
          <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] mb-1">إعدادات حسابي</h1>
          <p className="text-[var(--text-secondary)] font-medium">إدارة معلوماتك الشخصية، كلمة المرور، وتفضيلات الأمان.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-8 shadow-lg border-[var(--border-color)]">
            <div className="flex flex-col gap-6">
              <h3 className="text-[1.2rem] font-black text-[var(--text-primary)] flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/checked-user-male.png" width={24} height={24} alt="user" />
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[0.85rem] font-black text-[var(--text-secondary)] mb-2 mr-1">اسم المستخدم</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="input-field h-14 rounded-2xl" 
                    placeholder="اسم المستخدم الجديد"
                  />
                </div>
                <div>
                  <label className="block text-[0.85rem] font-black text-[var(--text-secondary)] mb-2 mr-1">البريد الإلكتروني (لا يمكن تغييره)</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="input-field h-14 rounded-2xl opacity-50 cursor-not-allowed bg-[var(--bg-secondary)]" 
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[var(--border-color)] w-full"></div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[1.2rem] font-black text-[var(--text-primary)] flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/256/lock.png" width={24} height={24} alt="security" />
                تغيير كلمة المرور
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[0.85rem] font-black text-[var(--text-secondary)] mb-2 mr-1">كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="input-field h-14 rounded-2xl" 
                    placeholder="اتركها فارغة إذا لا تريد التغيير"
                  />
                </div>
                {formData.password && (
                  <div>
                    <label className="block text-[0.85rem] font-black text-[var(--text-secondary)] mb-2 mr-1">كلمة المرور الحالية (للتأكيد)</label>
                    <input 
                      type="password" 
                      value={formData.currentPassword}
                      onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="input-field h-14 rounded-2xl border-emerald-500/30" 
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
              className="btn-primary w-full py-5 rounded-2xl text-[1.1rem] font-black flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : (
                <>
                  <img src="https://img.icons8.com/fluency/256/save.png" width={24} height={24} className="brightness-0 invert" alt="save" /> 
                  حفظ التغييرات
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card p-6 bg-[var(--bg-secondary)] border-none">
            <h4 className="text-[0.9rem] font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <img src="https://img.icons8.com/fluency/256/info.png" width={18} height={18} alt="info" />
              معلومات الحساب
            </h4>
            <div className="flex flex-col gap-4">
               <div>
                  <p className="text-[0.65rem] font-black text-[var(--text-secondary)] uppercase mb-1">تاريخ التسجيل</p>
                  <p className="text-[0.9rem] font-bold text-[var(--text-primary)]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '---'}</p>
               </div>
               <div>
                  <p className="text-[0.65rem] font-black text-[var(--text-secondary)] uppercase mb-1">الرصيد الحالي</p>
                  <p className="text-[1.2rem] font-black text-[var(--brand-primary)]" dir="ltr">${user?.balance?.toFixed(2) || '0.00'}</p>
               </div>
               <div>
                  <p className="text-[0.65rem] font-black text-[var(--text-secondary)] uppercase mb-1">نوع العضوية</p>
                  <span className="px-2 py-0.5 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-[0.7rem] rounded-full font-black uppercase tracking-tighter">{user?.role}</span>
               </div>
            </div>
          </div>

          <div className="card p-6 border-l-4 border-amber-500">
             <h4 className="text-[0.9rem] font-black text-amber-600 mb-2">أمان الحساب 💡</h4>
             <p className="text-[0.8rem] text-[var(--text-secondary)] leading-relaxed">
               تجنب استخدام كلمات مرور سهلة التخمين. ينصح بتغيير كلمة المرور كل 3 أشهر لزيادة الأمان.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
