import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArticleBody from '@/components/ArticleBody';
import ArticleSidebar from '@/components/ArticleSidebar';
import CategoryTag from '@/components/CategoryTag';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { getArticleBySlug, getArticleImage, getArticles } from '@/lib/articles';
import { copy, formatDate, getLocalizedArticle, withLang } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  const localized = getLocalizedArticle(article, 'ja');
  const imageUrl = getArticleImage(article);

  return {
    title: localized.title,
    description: localized.summary,
    openGraph: {
      title: localized.title,
      description: localized.summary,
      images: [imageUrl],
      locale: 'ja_JP'
    },
    alternates: {
      canonical: `/ja/article/${article.slug}`,
      languages: {
        en: `/article/${article.slug}`,
        ja: `/ja/article/${article.slug}`
      }
    }
  };
}

export default async function JapaneseArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  const localized = getLocalizedArticle(article, 'ja');
  const related = (await getArticles(article.category, 4)).filter(
    (item) => item.slug !== article.slug
  );
  const topStories = await getArticles(undefined, 8);
  const imageUrl = getArticleImage(article);

  return (
    <>
      <Header lang="ja" />
      <main className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,720px)_320px] lg:items-start lg:px-8 xl:grid-cols-[minmax(0,760px)_340px]">
          <article className="min-w-0">
            <div className="space-y-5">
              <CategoryTag category={article.category} lang="ja" />
              <time className="block text-sm font-bold text-zinc-500">
                {formatDate(article.published_at, 'ja')}
              </time>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-kai-navy">
                {localized.title}
              </h1>
              <p className="text-xl leading-8 text-zinc-700">{localized.summary}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-zinc-500">
                <span>KAI Brief Desk</span>
                <span>
                  {copy.ja.source}:{' '}
                  <a href={article.source_url} className="text-kai-navy underline">
                    {article.source_name}
                  </a>
                </span>
              </div>
            </div>

            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-kai-gray shadow-card">
              <Image
                src={imageUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 760px, (min-width: 768px) 720px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kai-navy/20 to-transparent" />
            </div>

            <hr className="my-8 border-kai-border" />

            <div className="mb-8 rounded-lg border border-kai-border bg-kai-gray px-5 py-4 text-sm leading-6 text-zinc-600">
              KAI Brief covers Korean source material with added context for readers outside Korea.
              The original source link is provided above for verification.
            </div>

            <ArticleBody body={localized.body} adSlotId="ja-article-ad-slot" />

            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-kai-gray px-3 py-1 text-sm font-bold">
                  #{tag}
                </span>
              ))}
            </div>

            <Link
              href={withLang('/', 'ja')}
              className="mt-10 inline-flex rounded-full border border-kai-border px-5 py-2 text-sm font-black text-kai-navy transition hover:bg-kai-gray"
            >
              {copy.ja.back}
            </Link>
          </article>

          <ArticleSidebar articles={topStories} currentSlug={article.slug} lang="ja" />
        </div>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="mb-5 text-2xl font-black text-kai-navy">{copy.ja.related}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.slice(0, 3).map((item, index) => (
              <NewsCard key={item.id} article={item} index={index} lang="ja" />
            ))}
          </div>
        </section>
      </main>
      <Footer lang="ja" />
    </>
  );
}
