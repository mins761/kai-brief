import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';
import CategoryBar from '@/components/CategoryBar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Newsletter from '@/components/Newsletter';
import NewsCard from '@/components/NewsCard';
import { categories, categoryLabels, getArticleCount, getArticles } from '@/lib/articles';
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

  return {
    title: `${categoryLabels[category]} News`,
    description: `Latest Korea ${categoryLabels[category].toLowerCase()} news from KAI Brief.`
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as Category;

  if (!categories.includes(category)) {
    notFound();
  }

  const [articles, count] = await Promise.all([
    getArticles(category, 12),
    getArticleCount(category)
  ]);

  return (
    <>
      <Header />
      <main>
        <section className="bg-kai-navy px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-kai-cyan">
              Category
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">
              {categoryLabels[category]}
            </h1>
            <p className="mt-4 text-white/65">{count} published brief{count === 1 ? '' : 's'}</p>
          </div>
        </section>
        <CategoryBar active={category} />
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </div>
          <div className="py-8">
            <AdBanner id={`ad-slot-${category}`} />
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(6).map((article, index) => (
              <NewsCard key={article.id} article={article} index={index + 6} />
            ))}
          </div>
        </section>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
