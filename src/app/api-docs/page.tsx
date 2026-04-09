"use client";
import { useState, useEffect } from 'react';
import { showToast } from '@/hooks/useNotification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
      <main dir="rtl" className="pt-[90px] min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-12">
              <span className="section-badge">للمطورين</span>
              <h1 className="text-[2.5rem] font-extrabold mt-4 text-[var(--text-primary)]">
                واجهة <span className="gradient-text">API</span> للمطورين
              </h1>
              <p className="text-[var(--text-secondary)] max-w-[600px] mx-auto mt-4 leading-relaxed">
                اربط خدماتنا بموقعك الخاص (SMM Panel) وابدأ بتنفيذ الطلبات آلياً.
              </p>
            </div>

            {/* API Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <div className="card p-6 text-center">
                <p className="text-[0.8rem] text-[var(--text-secondary)] font-semibold mb-1">طريقة HTTP</p>
                <p className="text-[1.2rem] font-extrabold text-[var(--brand-primary)]">POST</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-[0.8rem] text-[var(--text-secondary)] font-semibold mb-1">API URL</p>
                <p className="text-[0.85rem] font-bold text-[var(--text-primary)]" dir="ltr">https://smm-panel-olive.vercel.app/api/v2</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-[0.8rem] text-[var(--text-secondary)] font-semibold mb-1">صيغة الاستجابة</p>
                <p className="text-[1.2rem] font-extrabold text-[var(--brand-success)]">JSON</p>
              </div>
            </div>

            {/* API Key Section */}
            <div className="card p-8 mb-12 bg-[var(--gradient-stats)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--gradient-primary)]" />
              <h2 className="text-[1.3rem] font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2.5">
                <img src="https://img.icons8.com/fluency/256/key.png" width={24} height={24} alt="أيقونة المفتاح" /> إنشاء مفتاح API
              </h2>
              <p className="text-[var(--text-secondary)] text-[0.9rem] mb-6 leading-relaxed">
                هذا المفتاح بمثابة كلمة المرور لربط موقعك بموقعنا. إذا كنت تملك لوحة SMM خاصة كموزع (Reseller)، انسخ المفتاح وضعه في إعدادات المزودين في موقعك.
              </p>
              <div className="flex gap-3 flex-wrap">
                <input 
                  type="text" 
                  readOnly 
                  value={loading ? 'جاري التحميل...' : maskedKey} 
                  className="input-field flex-1 min-w-[250px] !font-mono text-[var(--brand-success)]" 
                  aria-label="رابط الـ API الخاص بك"
                  dir="ltr" 
                />
                <button className="btn-secondary !bg-[var(--bg-card)] flex items-center gap-2 !px-6" onClick={handleCopy} disabled={!apiKey}>
                  <img src="https://img.icons8.com/fluency/256/copy.png" width={18} height={18} alt="أيقونة النسخ" /> نسخ الرمز الحقيقي
                </button>
                <button className="btn-primary flex items-center gap-2 !px-6" onClick={handleRegenerate} disabled={!apiKey}>
                  <img src="https://img.icons8.com/fluency/256/synchronize.png" width={18} height={18} className="brightness-0 invert" alt="أيقونة التحديث" /> توليد مفتاح جديد
                </button>
              </div>
            </div>

            {/* Endpoints */}
            <div className="flex flex-col gap-8">
              {endpoints.map((ep, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
                    <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)] mb-1">{ep.title}</h3>
                    <p className="text-[0.85rem] text-[var(--text-secondary)]">{ep.desc}</p>
                  </div>
                  {ep.params.length > 0 && (
                    <div className="p-6 md:p-8 border-b border-[var(--border-color)] overflow-x-auto">
                      <table className="w-full border-collapse min-w-[500px]">
                        <thead>
                          <tr>
                            <th className="py-2 text-right text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase whitespace-nowrap">المعامل</th>
                            <th className="py-2 text-right text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase whitespace-nowrap">الوصف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map((p, j) => (
                            <tr key={j}>
                              <td className="py-2 text-[0.85rem]"><code className="bg-[var(--bg-secondary)] px-2 py-0.5 rounded-[4px] text-[0.8rem] font-bold text-[var(--brand-primary)]">{p.name}</code></td>
                              <td className="py-2 text-[0.85rem] text-[var(--text-secondary)]">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <p className="text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase mb-2">مثال على الاستجابة</p>
                    <pre className="bg-[var(--bg-secondary)] p-4 rounded-[var(--radius-md)] overflow-auto direction-ltr text-left">
                      <code className="text-[0.8rem] font-mono text-[var(--text-primary)]">{ep.response}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* PHP Example */}
            <div className="card mt-8 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">مثال كود PHP</h3>
              </div>
              <div className="p-6 md:p-8">
                <pre className="bg-[var(--bg-secondary)] p-6 rounded-[var(--radius-md)] overflow-auto direction-ltr text-left">
                  <code className="text-[0.8rem] font-mono text-[var(--text-primary)]">{`<?php
$api_url = 'https://smm-panel-olive.vercel.app/api/v2';
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
