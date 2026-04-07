"use client";

import { useEffect, useState } from 'react';
import { showToast } from '@/hooks/useNotification';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/deposits');
      const data = await res.json();
      if (data.deposits) {
        setDeposits(data.deposits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    const confirmation = window.confirm(`هل أنت متأكد من رغبتك في ${action === 'approve' ? 'موافقة' : 'رفض'} هذا الطلب؟\n(في حالة الموافقة سيتم إضافة المبلغ لرصيد العميل مباشرةً)`);
    if (!confirmation) return;

    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        showToast("تم تحديث حالة الطلب بنجاح", "success");
        fetchDeposits();
      } else {
        showToast("حدث خطأ أثناء التحديث", "error");
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
          <img src="https://img.icons8.com/fluency/256/money.png" width={40} height={40} /> الإيداعات المالية
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>مراجعة عمليات تحويل الأموال وتأكيدها بناءً على الإيصالات المرفقة</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {deposits.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <img src="https://img.icons8.com/fluency/256/mailbox-closed-flag-down.png" width={64} height={64} style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{ color: 'var(--text-primary)' }}>لا توجد طلبات إيداع حالياً</h3>
          </div>
        ) : (
          deposits.map(d => (
            <div key={d.id} className="card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
              
              {/* Receipt Image */}
              <div style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                <img src={d.receiptImage} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>

              {/* Details */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>طلب إيداع #{d.id}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span><strong>المبلغ:</strong></span>
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 800 }} dir="ltr">${d.amount.toFixed(2)}</span>
                  
                  <span><strong>الطريقة:</strong></span>
                  <span>{d.method}</span>
                  
                  <span><strong>المستخدم:</strong></span>
                  <span dir="ltr">{d.user?.username || 'غير معروف'} ({d.user?.email || ''})</span>

                  <span><strong>التاريخ:</strong></span>
                  <span dir="ltr">{new Date(d.createdAt).toLocaleString('ar-SA')}</span>
                  
                  <span><strong>الحالة:</strong></span>
                  <span>
                    {d.status === 'pending' && <span style={{ color: 'var(--brand-accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.1)', fontSize: '0.75rem' }}><img src="https://img.icons8.com/fluency/256/hourglass.png" width={14} height={14} /> قيد المراجعة</span>}
                    {d.status === 'completed' && <span style={{ color: 'var(--brand-success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-full)', background: 'rgba(16,185,129,0.1)', fontSize: '0.75rem' }}><img src="https://img.icons8.com/fluency/256/checkmark.png" width={14} height={14} /> تمت الموافقة</span>}
                    {d.status === 'rejected' && <span style={{ color: 'var(--brand-danger)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-full)', background: 'rgba(239,68,68,0.1)', fontSize: '0.75rem' }}><img src="https://img.icons8.com/fluency/256/delete-sign.png" width={14} height={14} /> مرفوض</span>}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '160px' }}>
                {d.status === 'pending' ? (
                  <>
                    <button className="btn-primary" style={{ background: 'var(--brand-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }} onClick={() => handleAction(d.id, 'approve')}>
                      <img src="https://img.icons8.com/fluency/256/checkmark.png" width={16} height={16} style={{ filter: 'brightness(0) invert(1)' }} /> موافقة
                    </button>
                    <button className="btn-secondary" style={{ color: 'var(--brand-danger)', borderColor: 'var(--brand-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }} onClick={() => handleAction(d.id, 'reject')}>
                      <img src="https://img.icons8.com/fluency/256/delete-sign.png" width={16} height={16} /> رفض
                    </button>
                  </>
                ) : (
                  <button className="btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}>
                    <img src="https://img.icons8.com/fluency/256/checked-lock.png" width={16} height={16} /> مغلق
                  </button>
                )}
                <a href={d.receiptImage} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.6rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <img src="https://img.icons8.com/fluency/256/search.png" width={16} height={16} /> فحص الإيصال
                </a>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
