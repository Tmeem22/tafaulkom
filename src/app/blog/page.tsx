import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const posts = [
  {
    slug: 'socialmedia03',
    title: 'معلومات عامة عن تويتر ويوتيوب',
    excerpt: 'قام مؤسسو موقع التويتر الثلاثة إيفان ويليامز، بيز ستون، وجاك دورسي بتأسيس شركة أوديو الأمريكية في عام 2004م. تعرف على تاريخ المنصتين وكيف أصبحتا من أكبر منصات التواصل الاجتماعي...',
    icon: 'https://img.icons8.com/color/256/twitter.png',
    date: '2025-03-15',
  },
  {
    slug: 'socialmedia02',
    title: 'معلومات عامة عن تيك توك وسناب شات',
    excerpt: 'تطبيق تيك توك هو نتاج عمل طويل وتجارب عديدة في مجال السوشيال ميديا. تعرف على قصة نجاح هذه المنصات وكيف غيّرت عالم المحتوى الق قصير...',
    icon: 'https://img.icons8.com/color/256/tiktok.png',
    date: '2025-02-20',
  },
  {
    slug: 'socialmedia01',
    title: 'معلومات عامة عن إنستغرام وفيسبوك',
    excerpt: 'إنستغرام موقع مجاني لتبادل الصور أُطلق في أكتوبر عام 2010 حيث قام بتأسيسه كيفن سيستروم. اكتشف كيف أصبح من أقوى منصات التواصل الاجتماعي...',
    icon: 'https://img.icons8.com/color/256/instagram-new.png',
    date: '2025-01-10',
  },
  {
    slug: 'smm',
    title: 'التسويق الإلكتروني - دليل شامل',
    excerpt: 'نظراً لتطور العالم وتطور أساليب عيشه، أصبح هناك ما يعرف بالتسويق عبر الإنترنت. تعرف على أهم استراتيجيات التسويق الرقمي الحديثة...',
    icon: 'https://img.icons8.com/fluency/256/line-chart.png',
    date: '2024-12-05',
  },
  {
    slug: 'about-us',
    title: 'عن منصة تفاعلكم',
    excerpt: 'بشكل عام موقعنا مختص بكل ما يتعلق بالسوشال ميديا والتسويق الإلكتروني. نهدف لتقديم أفضل الخدمات بأقل الأسعار لعملائنا في العالم العربي...',
    icon: 'https://img.icons8.com/fluency/256/info.png',
    date: '2024-11-01',
  },
];

export default function Blog() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-[90px] min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-12">
              <span className="section-badge">المدونة</span>
              <h1 className="text-[2.5rem] font-extrabold mt-4 text-[var(--text-primary)]">
                مدونة <span className="gradient-text">تفاعلكم</span>
              </h1>
              <p className="text-[var(--text-secondary)] max-w-[600px] mx-auto mt-4 leading-relaxed">
                اقرأ آخر المقالات والأخبار حول التسويق عبر وسائل التواصل الاجتماعي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <article key={i} className="card overflow-hidden group flex flex-col">
                  <div className="h-[180px] bg-[var(--gradient-stats)] flex items-center justify-center">
                    <img src={post.icon} width={80} height={80} alt={post.title} className="group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <time className="text-[0.75rem] text-[var(--text-tertiary)] font-bold">{post.date}</time>
                    <h2 className="text-[1.2rem] font-bold text-[var(--text-primary)] mt-2 mb-3 leading-tight">{post.title}</h2>
                    <p className="text-[var(--text-secondary)] text-[0.88rem] mb-5 leading-relaxed flex-1">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="no-underline">
                      <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[0.8rem] font-bold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all cursor-pointer">
                        إقرأ المزيد <img src="https://img.icons8.com/fluency/256/chevron-left.png" width={14} height={14} alt="السهم" className="group-hover:-translate-x-1 transition-transform" />
                      </span>
                    </Link>
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
