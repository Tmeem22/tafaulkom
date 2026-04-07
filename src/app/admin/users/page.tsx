"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';

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
      const input = window.prompt("أدخل المبلغ المراد إضافته לרصيد العميل:");
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
    } catch (e) {
      showToast("فشل الاتصال بالخادم", "error");
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src="https://img.icons8.com/fluency/256/group-of-projects.png" width={40} height={40} /> إدارة المستخدمين
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>التحكم الكامل في حسابات العملاء، أرصدتهم، وصلاحياتهم.</p>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>المعرف</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>المستخدم</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>البريد</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>الرصيد</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>الصلاحية</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>لا يوجد مستخدمين مسجلين بعد.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }} dir="ltr">{user.id.slice(0, 8)}...</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.username}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }} dir="ltr">{user.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--brand-primary)', fontWeight: 800 }} dir="ltr">${user.balance.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      background: user.role === 'ADMIN' ? 'var(--brand-danger)' : 'var(--bg-secondary)',
                      color: user.role === 'ADMIN' ? '#fff' : 'var(--text-primary)'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--brand-success)', gap: '0.4rem' }} onClick={() => handleAction(user.id, 'add_balance')}>
                      <img src="https://img.icons8.com/fluency/256/plus.png" width={14} height={14} style={{ filter: 'brightness(0) invert(1)' }} /> إضافة رصيد
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', gap: '0.4rem' }} onClick={() => handleAction(user.id, 'set_balance')}>
                      <img src="https://img.icons8.com/fluency/256/edit.png" width={14} height={14} /> تعديل
                    </button>
                    {user.role !== 'ADMIN' && (
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--brand-danger)', borderColor: 'var(--brand-danger)', gap: '0.4rem' }} onClick={() => handleAction(user.id, 'change_role')}>
                        <img src="https://img.icons8.com/fluency/256/crown.png" width={14} height={14} /> ترقية
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
