import AdBanner from '@/components/AdBanner';
import CategoryBar from '@/components/CategoryBar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Newsletter from '@/components/Newsletter';
import NewsCard from '@/components/NewsCard';
import { getArticles } from '@/lib/articles';

export const revalidate = 0;

export const metadata = {
  title: 'KAI Brief 日本語',
  description: '韓国のAI、経済、カルチャー、ビューティーのニュースを日本語で簡潔に。',
  alternates: {
    canonical: '/ja',
    languages: {
      en: '/',
      ja: '/ja'
    }
  },
  openGraph: {
    locale: 'ja_JP'
  }
};

export default async function JapaneseHomePage() {
  const articles = await getArticles(undefined, 12);
  const [featured, ...rest] = articles;

  return (
    <>
      <Header lang="ja" />
      <main>
        <HeroSection article={featured} lang="ja" />
        <CategoryBar active="all" lang="ja" />
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 6).map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} lang="ja" />
            ))}
          </div>
          <div className="py-8">
            <AdBanner id="ja-ad-slot-1" />
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.slice(6).map((article, index) => (
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
