import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const steps = [
  {
    num: '01', title: 'تسجيل حساب', icon: '📝',
    desc: 'يمكنك تسجيل حساب جديد في أي وقت عن طريق الضغط على زر التسجيل بالصفحة الرئيسية. يرجى استخدام معلوماتك الشخصية والفعالة عند التسجيل حتى يصلك كل جديد.',
  },
  {
    num: '02', title: 'تسجيل الدخول', icon: '🔑',
    desc: 'قم بتعبئة اسم المستخدم وكلمة المرور اللذين اخترتهما سابقاً لتسجيل الدخول والوصول إلى لوحة التحكم الخاصة بك.',
  },
  {
    num: '03', title: 'إضافة رصيد', icon: '💳',
    desc: 'قبل أن تتمكن من وضع الطلبات يجب أن تقوم بشحن حسابك من صفحة إضافة رصيد. لدينا العديد من طرق الدفع المتنوعة، يمكنك اختيار الطريقة المناسبة لك.',
  },
  {
    num: '04', title: 'آلية الطلب', icon: '🛒',
    desc: 'لوضع أي طلب: اذهب إلى صفحة طلب جديد → اختر القسم والخدمة → أدخل الرابط والكمية → اضغط تأكيد الطلب. يمكنك تتبع طلباتك من صفحة الطلبات.',
  },
  {
    num: '05', title: 'الدعم الفني', icon: '🎧',
    desc: 'إذا احتجت لأي استفسار أو واجهتك مشكلة، يمكنك دائماً مراسلتنا عن طريق صفحة الدعم الفني وتعبئة تذكرة جديدة، وسيتم الرد عليكم بأقرب وقت ممكن.',
  },
];

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ paddingTop: '90px', minHeight: '100vh' }}>
        <section style={{ padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-badge">كيفية الاستخدام</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-primary)' }}>
                كيف تعمل <span className="gradient-text">منصتنا</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.7 }}>
                هذه الصفحة ستوضح آلية استخدام الموقع بشكل سهل وخطوة بخطوة.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {steps.map((step, i) => (
                <div key={i} className="card" style={{ padding: '2rem 2.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '55px', height: '55px', borderRadius: '16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>
                    {step.num}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{step.title}</h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem' }}>
                ابدأ الآن مجاناً 🚀
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
