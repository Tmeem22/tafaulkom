import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const steps = [
  {
    num: '01', title: 'تسجيل حساب', icon: 'https://img.icons8.com/fluency/256/registration-form.png',
    desc: 'يمكنك تسجيل حساب جديد في أي وقت عن طريق الضغط على زر التسجيل بالصفحة الرئيسية. يرجى استخدام معلوماتك الشخصية والفعالة عند التسجيل حتى يصلك كل جديد.',
  },
  {
    num: '02', title: 'تسجيل الدخول', icon: 'https://img.icons8.com/fluency/256/key.png',
    desc: 'قم بتعبئة بريدك الإلكتروني وكلمة المرور اللذين اخترتهما سابقاً لتسجيل الدخول والوصول إلى لوحة التحكم الخاصة بك.',
  },
  {
    num: '03', title: 'إضافة رصيد', icon: 'https://img.icons8.com/fluency/256/card-exchange.png',
    desc: 'قبل أن تتمكن من وضع الطلبات يجب أن تقوم بشحن حسابك من صفحة إضافة رصيد. لدينا العديد من طرق الدفع المتنوعة، يمكنك اختيار الطريقة المناسبة لك.',
  },
  {
    num: '04', title: 'آلية الطلب', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png',
    desc: 'لوضع أي طلب: اذهب إلى صفحة طلب جديد ثم اختر القسم والخدمة، أدخل الرابط والكمية، واضغط تأكيد الطلب. يمكنك تتبع طلباتك من صفحة الطلبات.',
  },
  {
    num: '05', title: 'الدعم الفني', icon: 'https://img.icons8.com/fluency/256/headset.png',
    desc: 'إذا احتجت لأي استفسار أو واجهتك مشكلة، يمكنك دائماً مراسلتنا عن طريق صفحة الدعم الفني وتعبئة تذكرة جديدة، وسيتم الرد عليكم بأقرب وقت ممكن.',
  },
];

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-[90px] min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <span className="section-badge tracking-widest uppercase">كيفية الاستخدام</span>
              <h1 className="text-[2.5rem] font-black mt-4 text-[var(--text-primary)] leading-tight">
                كيف تعمل <span className="gradient-text tracking-tight">منصتنا</span>
              </h1>
              <p className="text-[var(--text-secondary)] max-w-[600px] mx-auto mt-4 leading-[1.8] text-[1.05rem]">
                هذه الصفحة ستوضح آلية استخدام الموقع بشكل سهل وخطوة بخطوة.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div key={i} className="card p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start group hover:translate-y-[-4px] transition-all duration-300">
                  <div className="w-[55px] h-[55px] rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center text-white font-black text-[1.2rem] flex-shrink-0 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center p-2 group-hover:bg-[var(--brand-primary)]/10 transition-colors">
                         <img src={step.icon} alt={step.title} width={32} height={32} />
                      </div>
                      <h2 className="text-[1.3rem] font-black text-[var(--text-primary)]">{step.title}</h2>
                    </div>
                    <p className="text-[var(--text-secondary)] leading-[1.8] text-[0.95rem] font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/register" className="btn-primary !px-12 !py-4 rounded-full !text-[1.1rem] !font-black inline-flex items-center gap-3 shadow-xl shadow-purple-500/25 hover:scale-105 transition-transform no-underline">
                <img src="https://img.icons8.com/fluency/256/rocket.png" width={24} height={24} className="brightness-0 invert" alt="صاروخ" />
                ابدأ الآن مجاناً
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
