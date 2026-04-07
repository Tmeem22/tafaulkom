"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
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

  if (loading) {
    return <div className="flex items-center justify-center h-[50vh]">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[2rem] font-extrabold text-[var(--text-primary)] flex items-center gap-3">
          <img src="https://img.icons8.com/fluency/256/group-of-projects.png" width={40} height={40} alt="أيقونة إدارة المستخدمين" /> إدارة المستخدمين
        </h1>
        <p className="text-[var(--text-secondary)]">التحكم الكامل في حسابات العملاء، أرصدتهم، وصلاحياتهم.</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full border-collapse text-right min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-semibold">
              <th className="p-4">المعرف</th>
              <th className="p-4">المستخدم</th>
              <th className="p-4">البريد</th>
              <th className="p-4">الرصيد</th>
              <th className="p-4">الصلاحية</th>
              <th className="p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--text-secondary)]">لا يوجد مستخدمين مسجلين بعد.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="p-4 text-[var(--text-secondary)] text-[0.8rem]" dir="ltr">{user.id.slice(0, 8)}...</td>
                  <td className="p-4 font-bold text-[var(--text-primary)]">{user.username}</td>
                  <td className="p-4 text-[var(--text-secondary)]" dir="ltr">{user.email}</td>
                  <td className="p-4 text-[var(--brand-primary)] font-extrabold" dir="ltr">{user.balance.toFixed(2)} {CURRENCY_SYMBOL}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-[4px] text-[0.8rem] font-bold ${
                      user.role === 'ADMIN' 
                        ? 'bg-[var(--brand-danger)] text-white' 
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 flex-wrap min-w-[280px]">
                    <button className="btn-primary !p-2 !px-4 !text-[0.8rem] !bg-[var(--brand-success)] !shadow-none flex items-center gap-1.5" onClick={() => handleAction(user.id, 'add_balance')}>
                      <img src="https://img.icons8.com/fluency/256/plus.png" width={14} height={14} className="brightness-0 invert" alt="إضافة" /> إضافة رصيد
                    </button>
                    <button className="btn-secondary !p-2 !px-4 !text-[0.8rem] flex items-center gap-1.5" onClick={() => handleAction(user.id, 'set_balance')}>
                      <img src="https://img.icons8.com/fluency/256/edit.png" width={14} height={14} alt="تعديل" /> تعديل
                    </button>
                    {user.role !== 'ADMIN' && (
                      <button className="btn-secondary !p-2 !px-4 !text-[0.8rem] !text-[var(--brand-danger)] !border-[var(--brand-danger)] flex items-center gap-1.5" onClick={() => handleAction(user.id, 'change_role')}>
                        <img src="https://img.icons8.com/fluency/256/crown.png" width={14} height={14} alt="ترقية" /> ترقية
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
