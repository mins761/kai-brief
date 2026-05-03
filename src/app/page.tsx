import AdBanner from '@/components/AdBanner';
import CategoryBar from '@/components/CategoryBar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Newsletter from '@/components/Newsletter';
import NewsCard from '@/components/NewsCard';
import { getArticles } from '@/lib/articles';

export const revalidate = 3600;

export default async function HomePage() {
  const articles = await getArticles(undefined, 12);
  const [featured, ...rest] = articles;

  return (
    <>
      <Header />
      <main>
        <HeroSection article={featured} />
        <CategoryBar active="all" />
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 6).map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </div>
          <div className="py-8">
            <AdBanner id="ad-slot-1" />
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.slice(6).map((article, index) => (
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
