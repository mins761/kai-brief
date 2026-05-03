import Link from 'next/link';
import CategoryTag from '@/components/CategoryTag';
import { formatRelativeTime } from '@/lib/articles';
import type { Article } from '@/types';

export default function HeroSection({ article }: { article: Article }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/article/${article.slug}`}
        className="grid gap-8 rounded-3xl border border-kai-border bg-white p-6 shadow-card transition hover:-translate-y-1 md:grid-cols-[1.1fr_0.9fr] md:p-10"
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
            {article.source_name} · {formatRelativeTime(article.published_at)}
          </p>
        </div>
        <div className="min-h-72 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.75),transparent_28%),linear-gradient(135deg,#1A1A2E,#0d6474)] p-6 text-white">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-kai-cyan">
            Featured
          </p>
          <p className="mt-28 max-w-xs text-2xl font-black leading-tight">
            Signal over noise from Korea&apos;s AI economy.
          </p>
        </div>
      </Link>
    </section>
  );
}
