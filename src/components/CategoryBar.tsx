import Link from 'next/link';
import { categoryLabels, visibleCategories } from '@/lib/articles';
import type { Category } from '@/types';

export default function CategoryBar({ active }: { active?: Category | 'all' }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-3 overflow-x-auto border-y border-kai-border py-4">
        <Link
          href="/"
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${
            !active || active === 'all' ? 'bg-kai-navy text-white' : 'bg-kai-gray text-kai-navy'
          }`}
        >
          All
        </Link>
        {visibleCategories.map((category) => (
          <Link
            key={category}
            href={`/${category}`}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${
              active === category ? 'bg-kai-cyan text-kai-navy' : 'bg-kai-gray text-kai-navy'
            }`}
          >
            {categoryLabels[category]}
          </Link>
        ))}
      </div>
    </div>
  );
}
