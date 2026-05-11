import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';
import CategoryBar from '@/components/CategoryBar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Newsletter from '@/components/Newsletter';
import NewsCard from '@/components/NewsCard';
import { categories, getArticleCount, getArticles } from '@/lib/articles';
import { categoryLabelsByLang, copy } from '@/lib/i18n';
import type { Category } from '@/types';

export const revalidate = 3600;

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = params.category as Category;

  if (!categories.includes(category)) {
    return {};
  }

  const label = categoryLabelsByLang.ja[category];

  return {
    title: `${label}ニュース`,
    description: `KAI Briefの韓国${label}ニュース最新記事。`,
    alternates: {
      canonical: `/ja/${category}`,
      languages: {
        en: `/${category}`,
        ja: `/ja/${category}`
      }
    },
    openGraph: {
      locale: 'ja_JP'
    }
  };
}

export default async function JapaneseCategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as Category;

  if (!categories.includes(category)) {
    notFound();
  }

  const [articles, count] = await Promise.all([
    getArticles(category, 12),
    getArticleCount(category)
  ]);
  const label = categoryLabelsByLang.ja[category];

  return (
    <>
      <Header lang="ja" />
      <main>
        <section className="bg-kai-navy px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-kai-cyan">
              {copy.ja.category}
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">{label}</h1>
            <p className="mt-4 text-white/65">
              {count}
              {count === 1 ? copy.ja.publishedBrief : copy.ja.publishedBriefs}
            </p>
          </div>
        </section>
        <CategoryBar active={category} lang="ja" />
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} lang="ja" />
            ))}
          </div>
          <div className="py-8">
            <AdBanner id={`ja-ad-slot-${category}`} />
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(6).map((article, index) => (
              <NewsCard key={article.id} article={article} index={index + 6} lang="ja" />
            ))}
          </div>
        </section>
        <Newsletter lang="ja" />
      </main>
      <Footer lang="ja" />
    </>
  );
}
