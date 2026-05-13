import Image from 'next/image';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { formatRelativeTime, getArticleImage } from '@/lib/articles';
import { getLocalizedArticle, type Lang, withLang } from '@/lib/i18n';
import type { Article } from '@/types';

const sidebarCopy = {
  en: {
    topStories: 'Top 5 Stories',
    interesting: 'Interesting contents',
    adLabel: 'Sponsored'
  },
  ja: {
    topStories: 'Top 5 Stories',
    interesting: 'Recommended',
    adLabel: 'Sponsored'
  }
} as const;

export default function ArticleSidebar({
  articles,
  currentSlug,
  lang = 'en'
}: {
  articles: Article[];
  currentSlug: string;
  lang?: Lang;
}) {
  const topStories = articles.filter((article) => article.slug !== currentSlug).slice(0, 5);
  const [leadStory, ...secondaryStories] = topStories;
  const showAdPlaceholders = process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === 'true';

  if (!leadStory) {
    return null;
  }

  const copy = sidebarCopy[lang];
  const lead = getLocalizedArticle(leadStory, lang);

  return (
    <aside className="w-full lg:sticky lg:top-28 lg:self-start">
      <section className="border-t-2 border-kai-navy pt-3">
        <h2 className="text-base font-black tracking-tight text-kai-navy">{copy.topStories}</h2>

        <Link href={withLang(`/article/${leadStory.slug}`, lang)} className="group mt-5 block">
          <div className="relative aspect-[4/3] overflow-hidden bg-kai-gray">
            <Image
              src={getArticleImage(leadStory)}
              alt=""
              fill
              sizes="(min-width: 1024px) 340px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="mt-3 grid grid-cols-[2rem_1fr] gap-3">
            <span className="font-serif text-3xl italic leading-none text-kai-cyan">1</span>
            <div>
              <h3 className="text-base font-black leading-snug text-kai-navy group-hover:underline">
                {lead.title}
              </h3>
              <p className="mt-1 text-xs font-semibold text-zinc-500">
                {formatRelativeTime(leadStory.published_at)}
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-4 divide-y divide-kai-border">
          {secondaryStories.map((article, index) => {
            const localized = getLocalizedArticle(article, lang);

            return (
              <Link
                key={article.id}
                href={withLang(`/article/${article.slug}`, lang)}
                className="grid grid-cols-[2rem_1fr_72px] gap-3 py-4 transition hover:bg-kai-gray/70"
              >
                <span className="font-serif text-3xl italic leading-none text-kai-cyan">
                  {index + 2}
                </span>
                <h3 className="text-sm font-bold leading-5 text-kai-navy">{localized.title}</h3>
                <div className="relative h-14 overflow-hidden bg-kai-gray">
                  <Image
                    src={getArticleImage(article)}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {showAdPlaceholders ? (
        <section className="mt-8 border-t-2 border-kai-navy pt-3">
          <h2 className="text-base font-black tracking-tight text-kai-navy">{copy.interesting}</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {copy.adLabel}
          </p>
          <div className="mt-4">
            <AdBanner id={lang === 'ja' ? 'ja-sidebar-ad-slot' : 'sidebar-ad-slot'} />
          </div>
        </section>
      ) : null}
    </aside>
  );
}
