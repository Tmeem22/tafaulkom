"use client";
import { useEffect, useState } from 'react';

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
        alert("تم تحديث حالة الطلب بنجاح");
        fetchDeposits();
      } else {
        alert("حدث خطأ أثناء التحديث");
      }
    } catch (e) {
      alert("فشل الاتصال بالخادم");
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>الإيداعات المالية 💸</h1>
        <p style={{ color: 'var(--text-secondary)' }}>مراجعة عمليات تحويل الأموال وتأكيدها بناءً على الإيصالات المرفقة</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {deposits.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
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
                    {d.status === 'pending' && <span style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>⏳ قيد المراجعة</span>}
                    {d.status === 'completed' && <span style={{ color: 'var(--brand-success)', fontWeight: 600 }}>✅ تمت الموافقة</span>}
                    {d.status === 'rejected' && <span style={{ color: 'var(--brand-danger)', fontWeight: 600 }}>✕ مرفوض</span>}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                {d.status === 'pending' ? (
                  <>
                    <button className="btn-primary" style={{ background: 'var(--brand-success)' }} onClick={() => handleAction(d.id, 'approve')}>✅ موافقة وتعبئة الرصيد</button>
                    <button className="btn-secondary" style={{ color: 'var(--brand-danger)', borderColor: 'var(--brand-danger)' }} onClick={() => handleAction(d.id, 'reject')}>✕ رفض الطلب</button>
                  </>
                ) : (
                  <button className="btn-secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>مغلق ({d.status})</button>
                )}
                <a href={d.receiptImage} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem', textAlign: 'center' }}>🔍 عرض الإيصال كامل</a>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
