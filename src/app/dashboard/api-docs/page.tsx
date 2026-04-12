"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { showToast } from '@/hooks/useNotification';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png' },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'الربط البرمجي (API)', href: '/dashboard/api-docs', icon: 'https://img.icons8.com/fluency/256/api.png', active: true },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'التسويق بالعمولة', href: '/dashboard/affiliate', icon: 'https://img.icons8.com/fluency/256/share.png' },
  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },
];

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(d => {
        if (d.apiKey) setApiKey(d.apiKey);
        setLoading(false);
      });
  }, []);

  const copyKey = () => {
    navigator.clipboard.writeText(`tf_live_${apiKey}`);
    showToast('تم نسخ مفتاح API بنجاح', 'success');
  };

  const generateNewKey = async () => {
    if (!confirm('هل أنت متأكد؟ إنشاء مفتاح جديد سيوقف عمل المفتاح الحالي فوراً وأية متاجر مرتبطة مسبقاً.')) return;
    try {
      const res = await fetch('/api/user/apikey', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setApiKey(data.apiKey);
        showToast('تم إنشاء مفتاح جديد بنجاح', 'success');
      } else {
        showToast('فشل إنشاء المفتاح', 'error');
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        {/* Sidebar */}
        <aside className="w-[280px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 fixed top-[70px] bottom-0 overflow-y-auto hidden lg:flex flex-col gap-2">
          {sideLinks.map((l, i) => (
            <Link key={i} href={l.href} className={`p-4 rounded-[20px] no-underline flex items-center gap-4 text-[0.85rem] font-black transition-all ${l.active ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              <img src={l.icon} width={24} height={24} alt={l.label} className={l.active ? 'brightness-0 invert' : ''} />
              {l.label}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:mr-[280px] p-6 lg:p-12">
          <div className="max-w-[1000px] mx-auto animate-fade-in-up">
            
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-[2.5rem] font-black text-[var(--text-primary)] mb-2 flex items-center gap-4">
                  <img src="https://img.icons8.com/fluency/256/api.png" width={48} height={48} alt="API" />
                  دليل الربط البرمجي (API)
                </h1>
                <p className="text-[1.1rem] text-[var(--text-secondary)] font-bold">اربط متجرك الخاص أو لوحتك بسيرفرنا آلياً وضاعف مبيعاتك.</p>
              </div>
              <a href="https://smmcpan.com/api" target="_blank" rel="noopener noreferrer" className="btn-secondary py-3 px-6 rounded-2xl flex items-center gap-2 font-bold opacity-70 hover:opacity-100">
                📄 توثيق API الكامل
              </a>
            </div>

            <div className="card p-8 rounded-[30px] border border-blue-500/30 bg-blue-500/5 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
                <div className="flex-1">
                    <p className="text-[0.8rem] text-blue-600 font-bold uppercase tracking-wider mb-2">المفتاح السري (API KEY)</p>
                    <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)]">
                        <code className="flex-1 text-[1.1rem] font-mono font-bold text-[var(--text-primary)]" dir="ltr">
                            {loading ? 'جاري التحميل...' : `tf_live_${apiKey}`}
                        </code>
                        <button onClick={copyKey} className="p-2 bg-[var(--bg-secondary)] hover:bg-gray-200 rounded-lg text-lg">📋</button>
                    </div>
                </div>
                <button onClick={generateNewKey} className="px-6 py-4 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white font-black rounded-2xl transition-all border border-red-500/20">
                    🔄 تغيير المفتاح
                </button>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-black border-r-4 border-[var(--brand-primary)] pr-4">إعدادات الربط السريع</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6 border border-[var(--border-color)] space-y-3">
                        <h3 className="font-black text-lg text-[var(--text-secondary)]">رابط الربط (API URL)</h3>
                        <code className="block p-4 bg-gray-900 text-green-400 font-mono rounded-xl text-sm" dir="ltr">
                            https://{typeof window !== 'undefined' ? window.location.hostname : 'tafaulkom.com'}/api/v2
                        </code>
                    </div>
                    <div className="card p-6 border border-[var(--border-color)] space-y-3">
                        <h3 className="font-black text-lg text-[var(--text-secondary)]">نوع الطلبات المدعومة</h3>
                        <code className="block p-4 bg-gray-900 text-blue-400 font-mono rounded-xl text-sm" dir="ltr">
                            POST / application/json
                        </code>
                    </div>
                </div>

                <div className="card p-8 border border-[var(--border-color)]">
                    <h3 className="font-black text-xl mb-6">أمثلة برمجية للاستخدام:</h3>
                    
                    <div className="space-y-4" dir="ltr">
                        <p className="text-sm font-bold text-gray-500 text-right" dir="rtl">مثال PHP لإضافة طلب جديد (Add Order):</p>
                        <pre className="p-6 bg-[#0d1117] text-[#c9d1d9] rounded-2xl overflow-x-auto text-[0.85rem] font-mono leading-relaxed border border-[#30363d] shadow-inner">
{`$api_url = 'https://${typeof window !== 'undefined' ? window.location.hostname : 'tafaulkom.com'}/api/v2';
$api_key = 'tf_live_YOUR_KEY_HERE';

$data = [
    'key' => $api_key,
    'action' => 'add',
    'service' => 123,
    'link' => 'https://tiktok.com/@username',
    'quantity' => 1000
];

$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
curl_close($ch);

echo $response;`}
                        </pre>
                    </div>

                    <div className="space-y-4 mt-8" dir="ltr">
                        <p className="text-sm font-bold text-gray-500 text-right" dir="rtl">مثال جلب الرصيد (Balance):</p>
                        <pre className="p-6 bg-[#0d1117] text-[#c9d1d9] rounded-2xl overflow-x-auto text-[0.85rem] font-mono leading-relaxed border border-[#30363d] shadow-inner">
{`{
  "key": "tf_live_YOUR_KEY_HERE",
  "action": "balance"
}`}
                        </pre>
                    </div>

                </div>

                <p className="text-sm text-[var(--text-secondary)] text-center font-bold px-10">
                    بوابتنا تدعم كافة أكواد PerfectPanel افتراضياً. فقط ضع الرابط ومفتاحك السري في متجرك وسيعمل فوراً دون تدخل برمجي.
                </p>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
