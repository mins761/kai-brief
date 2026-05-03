import { categoryColors, categoryLabels } from '@/lib/articles';
import type { Category } from '@/types';

export default function CategoryTag({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${categoryColors[category]}`}
    >
      {categoryLabels[category]}
    </span>
  );
}
