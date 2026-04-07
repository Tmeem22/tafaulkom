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
      <main dir="rtl" style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 700, marginBottom: '2rem', fontSize: '0.9rem' }}>
            <img src="https://img.icons8.com/fluency/256/right.png" width={16} height={16} /> العودة للمدونة
          </Link>

          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
             <div style={{ width: '120px', height: '120px', background: 'var(--bg-card)', borderRadius: '30px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow-lg)' }}>
               <img src={post.icon} width={64} height={64} />
             </div>
             <time style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{post.date}</time>
             <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--text-primary)', marginTop: '1rem', lineHeight: 1.2 }}>{post.title}</h1>
          </header>

          <div 
            className="blog-content"
            style={{ color: 'var(--text-secondary)', lineHeight: 2, fontSize: '1.1rem' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div style={{ marginTop: '4rem', padding: '3rem', borderRadius: 'var(--radius-xl)', background: 'var(--gradient-primary)', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>هل أنت مستعد لنمو حساباتك؟</h3>
            <p style={{ opacity: 0.9, marginBottom: '2rem' }}>ابدأ اليوم مع منصة تفاعلكم واحصل على نتائج حقيقية فورية.</p>
            <Link href="/register" style={{ background: 'white', color: 'var(--brand-primary)', padding: '1rem 2.5rem', borderRadius: 'var(--radius-full)', fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
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
