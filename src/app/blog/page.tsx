import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const posts = [
  {
    slug: 'socialmedia03',
    title: 'معلومات عامة عن تويتر ويوتيوب',
    excerpt: 'قام مؤسسو موقع التويتر الثلاثة إيفان ويليامز، بيز ستون، وجاك دورسي بتأسيس شركة أوديو الأمريكية في عام 2004م. تعرف على تاريخ المنصتين وكيف أصبحتا من أكبر منصات التواصل الاجتماعي...',
    icon: '🐦',
    date: '2025-03-15',
  },
  {
    slug: 'socialmedia02',
    title: 'معلومات عامة عن تيك توك وسناب شات',
    excerpt: 'تطبيق تيك توك هو نتاج عمل طويل وتجارب عديدة في مجال السوشيال ميديا. تعرف على قصة نجاح هذه المنصات وكيف غيّرت عالم المحتوى القصير...',
    icon: '🎵',
    date: '2025-02-20',
  },
  {
    slug: 'socialmedia01',
    title: 'معلومات عامة عن إنستغرام وفيسبوك',
    excerpt: 'إنستغرام موقع مجاني لتبادل الصور أُطلق في أكتوبر عام 2010 حيث قام بتأسيسه كيفن سيستروم. اكتشف كيف أصبح من أقوى منصات التواصل الاجتماعي...',
    icon: '📸',
    date: '2025-01-10',
  },
  {
    slug: 'smm',
    title: 'التسويق الإلكتروني - دليل شامل',
    excerpt: 'نظراً لتطور العالم وتطور أساليب عيشه، أصبح هناك ما يعرف بالتسويق عبر الإنترنت. تعرف على أهم استراتيجيات التسويق الرقمي الحديثة...',
    icon: '📊',
    date: '2024-12-05',
  },
  {
    slug: 'about-us',
    title: 'عن منصة تفاعلكم',
    excerpt: 'بشكل عام موقعنا مختص بكل ما يتعلق بالسوشال ميديا والتسويق الإلكتروني. نهدف لتقديم أفضل الخدمات بأقل الأسعار لعملائنا في العالم العربي...',
    icon: '💜',
    date: '2024-11-01',
  },
];

export default function Blog() {
  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ paddingTop: '90px', minHeight: '100vh' }}>
        <section style={{ padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-badge">المدونة</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-primary)' }}>
                مدونة <span className="gradient-text">تفاعلكم</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0' }}>
                اقرأ آخر المقالات والأخبار حول التسويق عبر وسائل التواصل الاجتماعي.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {posts.map((post, i) => (
                <article key={i} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ height: '180px', background: 'var(--gradient-stats)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem' }}>{post.icon}</span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <time style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{post.date}</time>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>{post.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>{post.excerpt}</p>
                    <span style={{ display: 'inline-block', padding: '0.4rem 1.2rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-primary)', cursor: 'pointer' }}>
                      إقرأ المزيد →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
