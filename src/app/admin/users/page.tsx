"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
      showToast("فشل جلب قائمة المستخدمين", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId: string, action: string) => {
    let amount;
    let newRole;

    if (action === 'add_balance') {
      const input = window.prompt("أدخل المبلغ المراد إضافته لرصيد العميل:");
      if (!input || isNaN(Number(input))) return;
      amount = Number(input);
    } else if (action === 'set_balance') {
      const input = window.prompt("أدخل الرصيد الجديد للعميل:");
      if (input === null || isNaN(Number(input))) return;
      amount = Number(input);
    } else if (action === 'change_role') {
      const confirmation = window.confirm("هل أنت متأكد من تغيير صلاحية هذا المستخدم إلى مدير النظام؟");
      if (!confirmation) return;
      newRole = 'ADMIN';
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, amount, newRole }),
      });

      if (res.ok) {
        showToast("تم التنفيذ بنجاح", "success");
        fetchUsers();
      } else {
        showToast("حدث خطأ أثناء التنفيذ", "error");
      }
    } catch (error) {
      showToast("فشل الاتصال بالخادم", "error");
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.includes(search)
  );

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
          <img src="https://img.icons8.com/fluency/256/hourglass.png" width={48} height={48} className="animate-spin mb-4" alt="تحميل" />
          <p className="font-bold">جاري تحميل قائمة المستخدمين...</p>
        </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] flex items-center gap-4">
            <img src="https://img.icons8.com/fluency/256/group-of-projects.png" width={45} height={45} alt="إدارة المستخدمين" /> إدارة المستخدمين
          </h1>
          <p className="text-[var(--text-secondary)] font-medium">التحكم الكامل في حسابات العملاء، الأرصدة، والصلاحيات.</p>
        </div>
        
        <div className="relative w-full md:w-80">
            <img src="https://img.icons8.com/fluency/256/search.png" width={20} height={20} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50" alt="search" />
            <input 
                type="text" 
                placeholder="ابحث بالاسم، البريد، أو المعرف..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pr-12 h-12 rounded-2xl shadow-sm"
            />
        </div>
      </div>

      <div className="card overflow-hidden shadow-lg border-[var(--border-color)]">
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right min-w-[900px]">
            <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="p-5 text-[0.85rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">المستخدم</th>
                <th className="p-5 text-[0.85rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الرصيد الحالي</th>
                <th className="p-5 text-[0.85rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">إجمالي الطلبات</th>
                <th className="p-5 text-[0.85rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الصلاحية</th>
                <th className="p-5 text-[0.85rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">تاريخ الانضمام</th>
                <th className="p-5 text-center text-[0.85rem] font-black text-[var(--text-secondary)] uppercase tracking-wider">الإجراءات</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
                {filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-20 text-center flex flex-col items-center gap-4">
                        <img src="https://img.icons8.com/article/128/nothing-found.png" width={64} height={64} className="opacity-20" alt="empty" />
                        <p className="text-[var(--text-tertiary)] font-bold">لم يتم العثور على مستخدمين يطابقون بحثك</p>
                    </td>
                </tr>
                ) : (
                filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-[var(--bg-secondary)]/50 transition-all group">
                    <td className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center font-black text-[var(--brand-primary)] shadow-inner">
                                {user.username[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-[var(--text-primary)] mb-0.5">{user.username}</p>
                                <p className="text-[0.75rem] text-[var(--text-tertiary)] font-medium" dir="ltr">{user.email}</p>
                            </div>
                        </div>
                    </td>
                    <td className="p-5 font-black text-[var(--brand-primary)]" dir="ltr">
                        {user.balance.toFixed(2)} {CURRENCY_SYMBOL}
                    </td>
                    <td className="p-5 font-bold text-[var(--text-secondary)]">
                        {user._count?.orders || 0} طلب
                    </td>
                    <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[0.7rem] font-black inline-flex items-center gap-2 ${
                        user.role === 'ADMIN' 
                            ? 'bg-red-500/10 text-red-500' 
                            : 'bg-blue-500/10 text-blue-500'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'ADMIN' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                            {user.role}
                        </span>
                    </td>
                    <td className="p-5 text-[0.8rem] font-semibold text-[var(--text-tertiary)]" dir="ltr">
                        {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-5">
                        <div className="flex justify-center gap-2">
                            <button 
                                className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border-none cursor-pointer flex items-center gap-2 font-bold text-[0.75rem]" 
                                onClick={() => handleAction(user.id, 'add_balance')}
                                title="إضافة رصيد"
                            >
                                <img src="https://img.icons8.com/fluency/256/plus.png" width={16} height={16} className="group-hover:brightness-0 group-hover:invert" alt="+" />
                                شحن
                            </button>
                            <button 
                                className="p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all border-none cursor-pointer flex items-center gap-2 font-bold text-[0.75rem]" 
                                onClick={() => handleAction(user.id, 'set_balance')}
                                title="تعديل الرصيد"
                            >
                                <img src="https://img.icons8.com/fluency/256/edit.png" width={16} height={16} alt="edit" />
                                تعديل
                            </button>
                            {user.role !== 'ADMIN' && (
                            <button 
                                className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all border-none cursor-pointer flex items-center gap-2 font-bold text-[0.75rem]" 
                                onClick={() => handleAction(user.id, 'change_role')}
                                title="ترقية لمدير"
                            >
                                <img src="https://img.icons8.com/fluency/256/crown.png" width={16} height={16} alt="crown" />
                                ترقية
                            </button>
                            )}
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
