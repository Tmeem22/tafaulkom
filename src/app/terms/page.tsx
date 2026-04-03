"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const tabs = [
  { key: 'general', label: 'بشكل عام' },
  { key: 'service', label: 'الخدمة' },
  { key: 'refund', label: 'سياسة الاسترجاع' },
  { key: 'privacy', label: 'سياسة الخصوصية' },
  { key: 'about', label: 'About Us' },
];

const content: Record<string, { title: string; body: string[] }> = {
  general: {
    title: 'بشكل عام',
    body: [
      'عند وضع طلب باستخدام موقع تفاعلكم، فإنك تقبل تلقائياً جميع شروط الخدمة المذكورة أدناه.',
      'نحن نحتفظ بالحق في تغيير شروط الخدمة هذه دون سابق إنذار. من المتوقع أن تقرأ جميع شروط الخدمة قبل تقديم أي طلب.',
      'لن تستخدم موقع تفاعلكم إلا بطريقة تتبع جميع الاتفاقات المبرمة مع المنصات الاجتماعية على صفحة شروط الخدمة الخاصة بهم.',
      'أسعار الخدمات بالموقع قابلة للتغيير في أي وقت دون سابق إنذار.',
      'تفاعلكم لا يضمن وقت التسليم لأي خدمات. نحن نقدم أفضل تقدير للوقت الذي سيتم فيه تسليم الطلب.',
      'توضيح: موقع تفاعلكم لن يكون مسؤولاً عن أي أضرار قد تتعرض لها أنت أو عملك.',
      'المسؤوليات: موقع تفاعلكم ليس مسؤولاً بأي حال من الأحوال عن أي حظر أو حذف يتم بواسطة أي من منصات التواصل الاجتماعي.',
    ]
  },
  service: {
    title: 'الخدمة',
    body: [
      'سيتم استخدام موقع تفاعلكم فقط للترويج لحساباتك على منصات التواصل الاجتماعي وللمساعدة في زيادة "المظهر" فقط.',
      'نحن لا نضمن أن يتفاعل المتابعون الجدد معك، نحن نضمن لك ببساطة الحصول على المتابعين الذين تدفع لهم مقابل ذلك.',
      'لن تقوم بتحميل أي شيء في موقع تفاعلكم بأي محتوى يحتوي على مواد غير مقبولة أو غير مناسبة.',
      'الحسابات الخاصة لن تحصل على أي تعويض أو إلغاء. يرجى التأكد من أن حسابك عام قبل الطلب.',
    ]
  },
  refund: {
    title: 'سياسة الاسترجاع',
    body: [
      'لن يتم رد أي مبالغ إلى طريقة الدفع الخاصة بك. بعد اكتمال الإيداع لا توجد طريقة لعكسه.',
      'أنت توافق على أنه بمجرد إتمام عملية الدفع لن تقدم نزاعاً ضدنا لأي سبب.',
      'إذا رفعت نزاعاً ضدنا، نحتفظ بالحق في إنهاء جميع الطلبات وحظرك من الموقع.',
      'لن تكون طلبات الحساب الخاطئ أو الخاص مؤهلة لاسترداد الأموال.',
      'النشاط الاحتيالي مثل استخدام بطاقات ائتمان غير مصرح بها سيؤدي إلى إنهاء حسابك.',
    ]
  },
  privacy: {
    title: 'سياسة الخصوصية',
    body: [
      'نحن نأخذ خصوصيتك على محمل الجد وسوف نتخذ جميع التدابير لحماية معلوماتك الشخصية.',
      'لن يتم استخدام أي معلومات شخصية يتم تلقيها إلا لملء طلبك.',
      'لن نبيع أو نعيد توزيع معلوماتك لأي شخص.',
      'يتم تشفير جميع المعلومات وحفظها في خوادم آمنة.',
    ]
  },
  about: {
    title: 'About Us',
    body: [
      'تفاعلكم هي منصة رائدة في خدمات التسويق عبر وسائل التواصل الاجتماعي.',
      'نهدف إلى تقديم أفضل الخدمات بأقل الأسعار لعملائنا في جميع أنحاء العالم العربي.',
      'فريقنا يعمل على مدار الساعة لضمان رضا العملاء وتقديم أعلى جودة ممكنة.',
    ]
  }
};

export default function Terms() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ paddingTop: '90px', minHeight: '100vh' }}>
        <section style={{ padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-badge">قانوني</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-primary)' }}>
                الشروط <span className="gradient-text">والأحكام</span>
              </h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${activeTab === tab.key ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                    background: activeTab === tab.key ? 'var(--gradient-cta)' : 'var(--bg-card)',
                    color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                {content[activeTab].title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {content[activeTab].body.map((paragraph, i) => (
                  <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
