import Image from 'next/image';
import Link from 'next/link';
import CategoryTag from '@/components/CategoryTag';
import { categoryImages, formatRelativeTime } from '@/lib/articles';
import type { Article } from '@/types';

export default function HeroSection({ article }: { article: Article }) {
  const imageUrl = article.image_url || categoryImages[article.category];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/article/${article.slug}`}
        className="grid gap-8 overflow-hidden rounded-3xl border border-kai-border bg-white p-6 shadow-card transition hover:-translate-y-1 md:grid-cols-[1.1fr_0.9fr] md:p-10"
      >
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <CategoryTag category={article.category} />
            <h1 className="max-w-4xl text-4xl font-black leading-[1.03] tracking-tight text-kai-navy md:text-6xl">
              {article.title_en}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-600">{article.summary_en}</p>
          </div>
          <p className="text-sm font-bold text-zinc-500">
            {article.source_name} - {formatRelativeTime(article.published_at)}
          </p>
        </div>
        <div className="relative min-h-72 overflow-hidden rounded-2xl bg-kai-navy p-6 text-white">
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.55),transparent_28%),linear-gradient(135deg,rgba(26,26,46,0.82),rgba(13,100,116,0.76))]" />
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-kai-cyan">
              Featured
            </p>
            <p className="mt-28 max-w-xs text-2xl font-black leading-tight">
              Signal over noise from Korea&apos;s AI economy.
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}
