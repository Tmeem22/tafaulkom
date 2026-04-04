"use client";
import { useState } from 'react';
import { showToast } from '@/hooks/useNotification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: '🛒' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: '📋' },
  { label: 'خدماتنا', href: '/services', icon: '⚡' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: '💳', active: true },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: '🎧' },
  { label: 'API', href: '/api-docs', icon: '🔗' },
];

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("حجم الصورة يجب أن يكون أقل من 5 ميجابايت", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !image) {
      showToast("الرجاء إدخال المبلغ وإرفاق صورة الإيصال", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'Bank Transfer',
          amount: amount,
          receiptImage: image
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setAmount('');
        setImage(null);
        showToast("تم إرسال طلب الشحن بنجاح", "success");
      } else {
        showToast("حدث خطأ أثناء الإرسال", "error");
      }
    } catch (error) {
      showToast("فشل الاتصال بالخادم", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', paddingTop: '70px' }}>
        <aside style={{ width: '250px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'fixed', top: '70px', bottom: '0', overflowY: 'auto' }}>
          <div style={{ padding: '1rem', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>الرصيد الحالي</p>
            <p style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900 }} dir="ltr">$0.00</p>
          </div>
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 600, background: l.active ? 'var(--bg-secondary)' : 'transparent', color: l.active ? 'var(--brand-primary)' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid var(--border-color)' }}>
            <Link href="/" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-danger)' }}>🚪 تسجيل الخروج</Link>
          </div>
        </aside>

        <div style={{ flex: 1, marginRight: '250px', padding: '2rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>إضافة رصيد (تحويل بنكي) 🏦</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>فضلاً قم بتحويل المبلغ على الحسابات المتوفرة ثم أرفق إيصال الدفع</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Bank Details Warning */}
              <div className="card" style={{ padding: '1.5rem', borderColor: 'var(--brand-primary)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>معلومات التحويل</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                  الرجاء تحويل المبلغ إلى الحساب البنكي التالي:<br/><br/>
                  <strong>اسم المستفيد:</strong> مؤسسة تسويق فيرال<br/>
                  <strong>رقم الحساب:</strong> 12345678901234<br/>
                  <strong>الآيبان:</strong> SA1234000000123456789012<br/><br/>
                  بعد التحويل، قم بتحديد المبلغ المودع وإرفاق صورة واضحة ومقروءة لإيصال التحويل، وستتم مراجعة طلبك وإضافة الرصيد في أقرب وقت.
                </p>
              </div>

              {/* Deposit Form */}
              <div className="card" style={{ padding: '2rem' }}>
                {showSuccess ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <span style={{ fontSize: '3rem' }}>✅</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>تم إرسال طلب الشحن بنجاح</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>تتم الآن مراجعة إيصالك من قبل الإدارة، سيتم إضافة الرصيد لحسابك فور التحقق منه.</p>
                    <button className="btn-secondary" style={{ marginTop: '2rem' }} onClick={() => setShowSuccess(false)}>إرسال طلب آخر</button>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>1. مبلغ الحوالة المودع (بـ $)</h2>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>$</span>
                      <input type="number" className="input-field" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} dir="ltr" style={{ paddingLeft: '2.5rem', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                      {quickAmounts.map(qa => (
                        <button key={qa} onClick={() => setAmount(qa.toString())} style={{
                          padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)',
                          border: `1.5px solid ${amount === qa.toString() ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                          background: amount === qa.toString() ? 'var(--gradient-cta)' : 'transparent',
                          color: amount === qa.toString() ? 'white' : 'var(--text-secondary)',
                          fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                        }}>
                          ${qa}
                        </button>
                      ))}
                    </div>

                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>2. إرفاق إيصال التحويل</h2>
                    <label style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '2.5rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-secondary)', cursor: 'pointer', marginBottom: '2rem', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      {image ? (
                        <div style={{ textAlign: 'center' }}>
                          <img src={image} alt="Receipt" style={{ maxHeight: '150px', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>تم إرفاق الصورة، اضغط هنا لتغييرها.</p>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>📷</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>اسحب وأفلت صورة الإيصال أو اضغط للاختيار</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>الصيغ المدعومة: JPG, PNG, WEBP (بحد أقصى 5MB)</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                    </label>

                    <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? '⏳ جاري الإرسال...' : 'ارسال طلب الشحن 🚀'}
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) { aside { display: none !important; } }
      `}</style>
    </>
  );
}
