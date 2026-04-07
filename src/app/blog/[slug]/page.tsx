"use client";

import { use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const posts = [
  {
    slug: 'socialmedia03',
    title: 'معلومات عامة عن تويتر ويوتيوب',
    content: `
      <h2>تاريخ منصة إكس (تويتر سابقاً)</h2>
      <p>تأسست المنصة في عام 2006م لتكون مكاناً لتبادل الرسائل القصيرة (التغريدات). واليوم أصبحت واحدة من أقوى قنوات التواصل لنشر الأخبار الفورية والتفاعل مع الجمهور العالمي.</p>
      <p>استخدام خدماتنا في تويتر يساعدك على زيادة المتابعين والإعجابات بشكل يضمن لك الوصول لعدد أكبر من المهتمين بمجالك.</p>

      <h2>يوتيوب وقوة الفيديو</h2>
      <p>يعتبر يوتيوب ثاني أكبر محرك بحث في العالم بعد جوجل. الوصول للانتشار فيه يتطلب محتوى متميزاً ودعماً فنياً لزيادة عدد المشتركين وساعات المشاهدة.</p>
      <p>خدمات تفاعلكم في يوتيوب تركز على تعزيز قناتك بشكل آمن وسريع.</p>
    `,
    icon: 'https://img.icons8.com/color/256/twitter.png',
    date: '2025-03-15',
  },
  {
    slug: 'socialmedia02',
    title: 'معلومات عامة عن تيك توك وسناب شات',
    content: `
      <h2>تيك توك وتغيير شكل المحتوى</h2>
      <p>غيّر تيك توك مفهوم الفيديوهات القصيرة وجذب ملايين المستخدمين حول العالم. التواجد في تيك توك اليوم ليس رفاهية، بل هو ضرورة لأي علامة تجارية تطمح للانتشار السريع.</p>
      
      <h2>سناب شات والتفاعل الخاص</h2>
      <p>يتميز سناب شات بطابع خاص وتفاعل يومي مرتفع، خاصة في العالم العربي. زيادة مشاهدات القصص والمتابعين تساهم في بناء علاقة قوية مع مئات المستخدمين.</p>
    `,
    icon: 'https://img.icons8.com/color/256/tiktok.png',
    date: '2025-02-20',
  },
  {
    slug: 'socialmedia01',
    title: 'معلومات عامة عن إنستغرام وفيسبوك',
    content: `
      <h2>عصر إنستغرام الذهبي</h2>
      <p>منذ إطلاقه، تصدر إنستغرام منصات مشاركة الصور والفيديوهات. اليوم مع نظام الريلز، أصبحت فرص الانتشار أوسع من أي وقت مضى.</p>
      <p>نحن نوفر لك أفضل الخدمات لزيادة نمو حسابك في إنستغرام وضمان ثبات المتابعين.</p>
      
      <h2>فيسبوك وبناء المجتمعات</h2>
      <p>رغم ظهور المنصات الجديدة، يظل فيسبوك المكان الأفضل لبناء المجموعات والمجتمعات المهتمة بمواضيع محددة.</p>
    `,
    icon: 'https://img.icons8.com/color/256/instagram-new.png',
    date: '2025-01-10',
  },
  {
    slug: 'smm',
    title: 'التسويق الإلكتروني - دليل شامل',
    content: `
      <h2>ما هو التسويق عبر وسائل التواصل الاجتماعي؟</h2>
      <p>التسويق الإلكتروني هو استخدام الأدوات الرقمية والمنصات التقنية للترويج للعلامات التجارية وبناء قاعدة عملاء مخلصة.</p>
      <h2>لماذا تحتاج لقوة منصة تفاعلكم؟</h2>
      <p>نحن ندرك أن البدايات صعبة، لذا نوفر لك الدفعة الأولى من التفاعل التي تشجع الآخرين على الوثوق بك ومتابعتك بشكل طبيعي.</p>
    `,
    icon: 'https://img.icons8.com/parakeet/256/line-chart.png',
    date: '2024-12-05',
  },
  {
    slug: 'about-us',
    title: 'عن منصة تفاعلكم',
    content: `
      <h2>رؤيتنا</h2>
      <p>نهدف إلى أن نكون المنصة رقم واحد في الوطن العربي التي توفر جميع حلول التسويق الرقمي بضمانات حقيقية وأسعار تنافسية.</p>
      <h2>من نخدم؟</h2>
      <p>نخدم أصحاب المتاجر، الفنانين، المؤثرين، والشركات الناشئة التي تسعى لزيادة مصداقيتها عبر الإنترنت من خلال التفاعل الحقيقي.</p>
    `,
    icon: 'https://img.icons8.com/parakeet/256/info.png',
    date: '2024-11-01',
  },
];

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-[100px] min-h-screen bg-[var(--bg-primary)]">
        <article className="max-w-[800px] mx-auto py-12 px-6">
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--brand-primary)] no-underline font-bold mb-8 text-[0.9rem] hover:opacity-80 transition-opacity">
            <img src="https://img.icons8.com/fluency/256/right.png" width={16} height={16} alt="سهم العودة" /> العودة للمدونة
          </Link>

          <header className="mb-12 text-center">
             <div className="w-[120px] h-[120px] bg-[var(--bg-card)] rounded-[30px] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-8 shadow-[var(--shadow-lg)]">
               <img src={post.icon} width={64} height={64} alt={post.title} />
             </div>
             <time className="text-[0.85rem] text-[var(--text-tertiary)] font-semibold">{post.date}</time>
             <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-[var(--text-primary)] mt-4 leading-tight">{post.title}</h1>
          </header>

          <div 
            className="blog-content text-[var(--text-secondary)] leading-[2] text-[1.10rem]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 p-12 rounded-[var(--radius-xl)] bg-[var(--gradient-primary)] text-white text-center shadow-xl">
            <h3 className="text-[1.5rem] font-extrabold mb-4">هل أنت مستعد لنمو حساباتك؟</h3>
            <p className="opacity-90 mb-8 leading-relaxed">ابدأ اليوم مع منصة تفاعلكم واحصل على نتائج حقيقية فورية.</p>
            <Link href="/register" className="bg-white text-[var(--brand-primary)] px-10 py-4 rounded-full font-extrabold no-underline inline-block hover:scale-105 hover:shadow-lg transition-all">
               سجّل الآن في تفاعلكم
            </Link>
          </div>
        </article>
      </main>

      <style jsx global>{`
        .blog-content h2 { color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 800; font-size: 1.5rem; }
        .blog-content p { margin-bottom: 1.5rem; }
      `}</style>
      
      <Footer />
    </>
  );
}
