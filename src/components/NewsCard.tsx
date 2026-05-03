'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CategoryTag from '@/components/CategoryTag';
import { formatRelativeTime } from '@/lib/articles';
import type { Article } from '@/types';

export default function NewsCard({ article, index = 0 }: { article: Article; index?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`rounded-lg border border-kai-border bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-card ${
        visible ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 0.1}s` }}
    >
      <Link href={`/article/${article.slug}`} className="flex h-full flex-col gap-4">
        <CategoryTag category={article.category} />
        <div className="space-y-3">
          <h2 className="line-clamp-2 text-lg font-black leading-snug text-kai-navy">
            {article.title_en}
          </h2>
          <p className="line-clamp-3 text-sm leading-6 text-zinc-600">{article.summary_en}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs font-semibold text-zinc-500">
          <span>
            {article.source_name} · {formatRelativeTime(article.published_at)}
          </span>
          <span className="text-lg text-kai-cyan" aria-hidden>
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
