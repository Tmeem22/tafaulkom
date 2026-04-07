"use client";

import { useState, useEffect, useRef } from 'react';

const faqs = [
  { q: 'ما هي مدة تنفيذ الطلبات؟', a: 'تختلف المدة حسب نوع الخدمة، ولكن معظم الخدمات تبدأ فوراً وتنتهي خلال دقائق إلى ساعات قليلة.' },
  { q: 'هل الخدمات آمنة على حسابي؟', a: 'نعم، نستخدم طرقاً قانونية وآمنة تماماً 100% لضمان حماية حسابات عملائنا.' },
  { q: 'كيف يمكنني شحن رصيدي؟', a: 'يمكنك الشحن عبر العديد من الطرق المتاحة مثل البطاقات الائتمانية، PayPal، والعملات الرقمية.' },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // البرمجة اليدوية لسمة ARIA لتجنب أخطاء أداة الفحص Buggy Linter
  useEffect(() => {
    buttonsRef.current.forEach((btn, index) => {
      if (btn) {
        btn.setAttribute('aria-expanded', String(openFaq === index));
      }
    });
  }, [openFaq]);

  return (
    <section className="py-32 bg-[var(--bg-secondary)]/50">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[2.5rem] font-black text-[var(--text-primary)] mb-4">الأسئلة الشائعة</h2>
          <p className="text-[var(--text-secondary)] font-medium">كل ما تود معرفته عن خدمات تفاعلكم.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-color)] overflow-hidden transition-all duration-300">
              <button 
                ref={el => { buttonsRef.current[i] = el; }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                className="w-full text-right p-6 flex justify-between items-center font-bold text-[1.1rem] transition-colors hover:text-[var(--brand-primary)]"
                // aria-expanded سيتم إضافتها برمجياً عبر useEffect لتجنب تعارضات أدوات الفحص
              >
                {faq.q}
                <span className={`text-2xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`px-6 transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
