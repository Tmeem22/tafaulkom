"use client";
import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const endpoints = [
  {
    title: 'Service list',
    desc: 'الحصول على قائمة جميع الخدمات المتاحة',
    params: [
      { name: 'key', desc: 'مفتاح API الخاص بك' },
      { name: 'action', desc: '"services"' },
    ],
    response: `[
  {
    "service": 1,
    "name": "Followers",
    "type": "Default",
    "category": "Instagram",
    "rate": "0.90",
    "min": "50",
    "max": "10000",
    "refill": true,
    "cancel": true
  }
]`
  },
  {
    title: 'Add order',
    desc: 'إضافة طلب جديد',
    params: [
      { name: 'key', desc: 'مفتاح API الخاص بك' },
      { name: 'action', desc: '"add"' },
      { name: 'service', desc: 'رقم الخدمة' },
      { name: 'link', desc: 'رابط الحساب/المنشور' },
      { name: 'quantity', desc: 'الكمية المطلوبة' },
    ],
    response: `{ "order": 23501 }`
  },
  {
    title: 'Order status',
    desc: 'التحقق من حالة الطلب',
    params: [
      { name: 'key', desc: 'مفتاح API الخاص بك' },
      { name: 'action', desc: '"status"' },
      { name: 'order', desc: 'رقم الطلب' },
    ],
    response: `{
  "charge": "0.27819",
  "start_count": "3572",
  "status": "Partial",
  "remains": "157",
  "currency": "USD"
}`
  },
  {
    title: 'Multiple orders status',
    desc: 'التحقق من حالة عدة طلبات',
    params: [
      { name: 'key', desc: 'مفتاح API الخاص بك' },
      { name: 'action', desc: '"status"' },
      { name: 'orders', desc: 'أرقام الطلبات مفصولة بفاصلة' },
    ],
    response: `{
  "1": { "charge": "0.27819", "status": "Partial", "remains": "157" },
  "100": { "charge": "1.44219", "status": "In progress", "remains": "10" }
}`
  },
  {
    title: 'Create refill',
    desc: 'إنشاء طلب تعويض',
    params: [
      { name: 'key', desc: 'مفتاح API الخاص بك' },
      { name: 'action', desc: '"refill"' },
      { name: 'order', desc: 'رقم الطلب' },
    ],
    response: `{ "refill": "1" }`
  },
  {
    title: 'Create cancel',
    desc: 'إلغاء طلب',
    params: [
      { name: 'key', desc: 'مفتاح API الخاص بك' },
      { name: 'action', desc: '"cancel"' },
      { name: 'orders', desc: 'أرقام الطلبات' },
    ],
    response: `[
  { "order": 9, "cancel": { "error": "Incorrect order ID" } },
  { "order": 2, "cancel": 1 }
]`
  },
  {
    title: 'User balance',
    desc: 'الحصول على رصيد الحساب',
    params: [
      { name: 'key', desc: 'مفتاح API الخاص بك' },
      { name: 'action', desc: '"balance"' },
    ],
    response: `{ "balance": "100.84292", "currency": "USD" }`
  },
];

export default function APIDocs() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/apikey')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) setApiKey(data.apiKey);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRegenerate = async () => {
    const confirm = window.confirm("هل أنت متأكد من تغيير الرمز؟ أي موقع مرتبط برمزك الحالي سيتوقف عن العمل.");
    if (!confirm) return;
    try {
      const res = await fetch('/api/user/apikey', { method: 'POST' });
      const data = await res.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        showToast('تم تغيير رمز API بنجاح!', 'success');
      }
    } catch {
      showToast('حدث خطأ', 'error');
    }
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    showToast('تم نسخ الرمز السري بنجاح!', 'success');
  };

  const maskedKey = apiKey ? `tf_live_${'*'.repeat(24)}` : 'يجب تسجيل الدخول لرؤية رمزك';

  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ paddingTop: '90px', minHeight: '100vh' }}>
        <section style={{ padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-badge">للمطورين</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-primary)' }}>
                واجهة <span className="gradient-text">API</span> للمطورين
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0' }}>
                اربط خدماتنا بموقعك الخاص (SMM Panel) وابدأ بتنفيذ الطلبات آلياً.
              </p>
            </div>

            {/* API Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>طريقة HTTP</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>POST</p>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>API URL</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }} dir="ltr">https://tafaulkom.app/api/v2</p>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>صيغة الاستجابة</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-success)' }}>JSON</p>
              </div>
            </div>

            {/* API Key Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '3rem', background: 'var(--gradient-stats)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '4px', background: 'var(--gradient-primary)' }} />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img src="https://img.icons8.com/parakeet/256/key.png" width={24} height={24} /> إنشاء مفتاح API
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                هذا المفتاح بمثابة كلمة المرور لربط موقعك بموقعنا. إذا كنت تملك لوحة SMM خاصة كموزع (Reseller)، انسخ المفتاح وضعه في إعدادات المزودين في موقعك.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input type="text" readOnly value={loading ? 'جاري التحميل...' : maskedKey} className="input-field" style={{ flex: '1', minWidth: '250px', fontFamily: 'monospace', color: 'var(--brand-success)' }} dir="ltr" />
                <button className="btn-secondary" onClick={handleCopy} disabled={!apiKey} style={{ background: 'var(--bg-card)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src="https://img.icons8.com/parakeet/256/copy.png" width={18} height={18} /> نسخ الرمز الحقيقي
                </button>
                <button className="btn-primary" onClick={handleRegenerate} disabled={!apiKey} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src="https://img.icons8.com/parakeet/256/synchronize.png" width={18} height={18} style={{ filter: 'brightness(0) invert(1)' }} /> توليد مفتاح جديد
                </button>
              </div>
            </div>

            {/* Endpoints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {endpoints.map((ep, i) => (
                <div key={i} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{ep.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ep.desc}</p>
                  </div>
                  {ep.params.length > 0 && (
                    <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '0.5rem 0', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>المعامل</th>
                            <th style={{ padding: '0.5rem 0', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>الوصف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map((p, j) => (
                            <tr key={j}>
                              <td style={{ padding: '0.4rem 0', fontSize: '0.85rem' }}><code style={{ background: 'var(--bg-secondary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-primary)' }}>{p.name}</code></td>
                              <td style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div style={{ padding: '1rem 2rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>مثال على الاستجابة</p>
                    <pre style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', overflow: 'auto', direction: 'ltr', textAlign: 'left' }}>
                      <code style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{ep.response}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* PHP Example */}
            <div className="card" style={{ marginTop: '2rem', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>مثال كود PHP</h3>
              </div>
              <div style={{ padding: '1rem 2rem' }}>
                <pre style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', overflow: 'auto', direction: 'ltr', textAlign: 'left' }}>
                  <code style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{`<?php
$api_url = 'https://tafaulkom.app/api/v2';
$api_key = 'YOUR_API_KEY';

$data = [
    'key' => $api_key,
    'action' => 'add',
    'service' => 1,
    'link' => 'https://instagram.com/username',
    'quantity' => 1000
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response; // {"order": 23501}
?>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
