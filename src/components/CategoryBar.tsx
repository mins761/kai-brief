import Link from 'next/link';
import { visibleCategories } from '@/lib/articles';
import { categoryLabelsByLang, copy, type Lang, withLang } from '@/lib/i18n';
import type { Category } from '@/types';

export default function CategoryBar({
  active,
  lang = 'en'
}: {
  active?: Category | 'all';
  lang?: Lang;
}) {
  const labels = categoryLabelsByLang[lang];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-3 overflow-x-auto border-y border-kai-border py-4">
        <Link
          href={withLang('/', lang)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${
            !active || active === 'all' ? 'bg-kai-navy text-white' : 'bg-kai-gray text-kai-navy'
          }`}
        >
          {copy[lang].all}
        </Link>
        {visibleCategories.map((category) => (
          <Link
            key={category}
            href={withLang(`/${category}`, lang)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${
              active === category ? 'bg-kai-cyan text-kai-navy' : 'bg-kai-gray text-kai-navy'
            }`}
          >
            {labels[category]}
          </Link>
        ))}
      </div>
    </div>
  );
}
