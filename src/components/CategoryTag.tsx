import { categoryColors } from '@/lib/articles';
import { categoryLabelsByLang, type Lang } from '@/lib/i18n';
import type { Category } from '@/types';

export default function CategoryTag({ category, lang = 'en' }: { category: Category; lang?: Lang }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${categoryColors[category]}`}
    >
      {categoryLabelsByLang[lang][category]}
    </span>
  );
}
