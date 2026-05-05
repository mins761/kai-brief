import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import CategoryTag from '@/components/CategoryTag';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { getArticleBySlug, getArticleImage, getArticles } from '@/lib/articles';

export const revalidate = 3600;

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  const imageUrl = getArticleImage(article);

  return {
    title: article.title_en,
    description: article.summary_en,
    openGraph: {
      title: article.title_en,
      description: article.summary_en,
      images: [imageUrl]
    },
    alternates: {
      canonical: `/article/${article.slug}`
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  const related = (await getArticles(article.category, 4)).filter(
    (item) => item.slug !== article.slug
  );
  const paragraphs = article.body_en.split(/\n+/).filter(Boolean);
  const imageUrl = getArticleImage(article);

  return (
    <>
      <Header />
      <main className="bg-white">
        <article className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
          <div className="space-y-5">
            <CategoryTag category={article.category} />
            <time className="block text-sm font-bold text-zinc-500">
              {new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(
                new Date(article.published_at)
              )}
            </time>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-kai-navy">
              {article.title_en}
            </h1>
            <p className="text-sm text-zinc-500">
              Source:{' '}
              <a href={article.source_url} className="font-bold text-kai-navy underline">
                {article.source_name}
              </a>
            </p>
          </div>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-kai-gray shadow-card">
            <Image
              src={imageUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kai-navy/20 to-transparent" />
          </div>

          <hr className="my-8 border-kai-border" />

          <div className="space-y-7 text-lg leading-[1.8] text-zinc-800">
            {paragraphs.map((paragraph, index) => (
              <div key={paragraph.slice(0, 24)}>
                <p>{paragraph}</p>
                {index === 2 ? (
                  <div className="my-8">
                    <AdBanner id="article-ad-slot" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-kai-gray px-3 py-1 text-sm font-bold">
                #{tag}
              </span>
            ))}
          </div>

          <Link
            href="/"
            className="mt-10 inline-flex rounded-full border border-kai-border px-5 py-2 text-sm font-black text-kai-navy transition hover:bg-kai-gray"
          >
            Back to briefs
          </Link>
        </article>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="mb-5 text-2xl font-black text-kai-navy">Related briefs</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.slice(0, 3).map((item, index) => (
              <NewsCard key={item.id} article={item} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
