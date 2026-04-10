"use client";
import { useState } from 'react';

const FAQ_DATA = [
  { q: 'كيف أشحن رصيدي؟', a: 'اضغط على "إضافة رصيد" من القائمة الجانبية، اختر طريقة الدفع المناسبة (تحويل بنكي أو USDT)، أرسل المبلغ وارفق صورة الإيصال. سيتم شحن رصيدك خلال 5-30 دقيقة.', icon: '💳' },
  { q: 'كم يستغرق الطلب؟', a: 'معظم الخدمات تبدأ خلال 0-12 ساعة من الطلب. بعض الخدمات المميزة قد تستغرق حتى 24 ساعة. يمكنك متابعة حالة طلبك من صفحة "طلباتي".', icon: '⏱️' },
  { q: 'ما أفضل خدمة لزيادة المتابعين؟', a: 'ننصح بخدمات المتابعين ذات الجودة العالية (HQ) لأنها حقيقية أكثر ولا تنخفض بسرعة. ابحث عن الخدمات التي تحمل علامة "مضمون" أو "بدون نقصان".', icon: '📈' },
  { q: 'هل الخدمات آمنة على حسابي؟', a: 'نعم! جميع خدماتنا آمنة 100% ولا تتطلب كلمة مرور حسابك. نستخدم فقط رابط حسابك العام. لا خطر على حسابك إطلاقاً.', icon: '🔒' },
  { q: 'ماذا لو لم يكتمل الطلب؟', a: 'إذا لم يكتمل طلبك خلال المدة المحددة، يمكنك طلب "استرداد" من صفحة طلباتي وسيتم إرجاع المبلغ المتبقي لرصيدك تلقائياً.', icon: '🔄' },
  { q: 'كيف أستفيد من نظام النقاط؟', a: 'تكتسب نقاط مع كل عملية شراء (10-50 نقطة حسب المبلغ). يمكنك استبدال كل 500 نقطة بـ $2.5 رصيد من صفحة "نظام النقاط".', icon: '🪙' },
  { q: 'كيف يعمل التسويق بالعمولة؟', a: 'شارك رابط الإحالة الخاص بك مع أصدقائك. عندما يسجلون ويشترون خدمات، تحصل على 1.5% عمولة من كل عملية شراء. يمكنك سحب الأرباح لرصيدك الأساسي.', icon: '🤝' },
  { q: 'ما هي الساعة الذهبية؟', a: 'كل يوم من الساعة 9 إلى 10 مساءً، نقدم خصم 30% على جميع الخدمات! تابع البانر أعلى الموقع لمعرفة الوقت المتبقي.', icon: '⏰' },
  { q: 'كيف أتواصل مع الدعم الفني؟', a: 'افتح تذكرة دعم من صفحة "الدعم الفني" في القائمة الجانبية. فريقنا يرد عادة خلال 30 دقيقة إلى ساعتين.', icon: '🎧' },
  { q: 'هل يمكنني استخدام API؟', a: 'نعم! لدينا API متكامل يدعم جميع العمليات (طلب خدمات، استعلام عن الحالة). احصل على مفتاح API من صفحة حسابك واقرأ التوثيق.', icon: '🔧' },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isBot: boolean}[]>([
    { text: 'أهلاً! 👋 أنا المساعد الذكي لمنصة تفاعلكم. كيف أقدر أساعدك اليوم?', isBot: true }
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleQuestion = (q: string, a: string) => {
    setMessages(prev => [...prev, { text: q, isBot: false }, { text: a, isBot: true }]);
    setShowSuggestions(false);
    setTimeout(() => setShowSuggestions(true), 500);
  };

  const handleCustomInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as any).elements.msg.value.trim();
    if (!input) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);
    (e.target as any).reset();

    // Simple keyword matching
    const lower = input.toLowerCase();
    const matched = FAQ_DATA.find(f => 
      f.q.includes(input) || 
      lower.includes('شحن') || lower.includes('رصيد') ? f.q.includes('شحن') :
      lower.includes('طلب') || lower.includes('وقت') || lower.includes('يستغرق') ? f.q.includes('يستغرق') :
      lower.includes('متابع') ? f.q.includes('متابعين') :
      lower.includes('آمن') || lower.includes('أمان') ? f.q.includes('آمنة') :
      lower.includes('نقاط') || lower.includes('نقطة') ? f.q.includes('النقاط') :
      lower.includes('عمول') || lower.includes('إحال') ? f.q.includes('العمولة') :
      lower.includes('دعم') || lower.includes('تواصل') ? f.q.includes('أتواصل') :
      lower.includes('api') ? f.q.includes('API') :
      false
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: matched?.a || 'شكراً لسؤالك! 😊 للإجابة الدقيقة، أنصحك بفتح تذكرة دعم فني من القائمة الجانبية وفريقنا سيساعدك بأسرع وقت.',
        isBot: true
      }]);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--brand-primary)] text-white shadow-xl shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-all"
        title="المساعد الذكي"
      >
        {isOpen ? <span className="text-[1.2rem]">✕</span> : <span className="text-[1.5rem]">🤖</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[500px] bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden" dir="rtl">
          {/* Header */}
          <div className="bg-[var(--brand-primary)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[1.2rem]">🤖</div>
            <div>
              <p className="text-white font-black text-[0.9rem]">المساعد الذكي</p>
              <p className="text-white/70 text-[0.7rem] font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" /> متصل الآن
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[280px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[0.8rem] leading-relaxed ${
                  msg.isBot 
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-br-sm' 
                    : 'bg-[var(--brand-primary)] text-white rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions */}
          {showSuggestions && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
              {FAQ_DATA.slice(0, 5).map((faq, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestion(faq.q, faq.a)}
                  className="text-[0.65rem] font-bold bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2.5 py-1.5 rounded-full hover:bg-[var(--brand-primary)] hover:text-white transition-all whitespace-nowrap"
                >
                  {faq.icon} {faq.q.substring(0, 25)}...
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleCustomInput} className="p-3 border-t border-[var(--border-color)] flex gap-2">
            <input
              name="msg"
              placeholder="اكتب سؤالك..."
              className="flex-1 bg-[var(--bg-secondary)] border-none rounded-xl px-3 py-2.5 text-[0.8rem] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30"
            />
            <button type="submit" className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl text-white flex items-center justify-center text-[1rem] hover:brightness-110 transition-all flex-shrink-0">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
