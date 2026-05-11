import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { categoryLabelsByLang } from '@/lib/i18n';
import type { Article, Category } from '@/types';

export const categories: Category[] = [
  'economy',
  'ai',
  'policy',
  'market',
  'culture',
  'beauty',
  'travel'
];

export const visibleCategories: Category[] = ['economy', 'ai', 'culture', 'beauty', 'travel'];

export const categoryLabels = categoryLabelsByLang.en;

export const categoryColors: Record<Category, string> = {
  economy: 'bg-blue-100 text-blue-700',
  ai: 'bg-cyan-100 text-cyan-700',
  policy: 'bg-green-100 text-green-700',
  market: 'bg-orange-100 text-orange-700',
  culture: 'bg-pink-100 text-pink-700',
  beauty: 'bg-rose-100 text-rose-700',
  travel: 'bg-green-100 text-green-700'
};

export const categoryImages: Record<Category, string> = {
  economy: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
  ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
  culture: '/images/fallback-kpop.webp',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
  travel: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
  market: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  policy: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800'
};

export function getArticleImage(article: Pick<Article, 'category' | 'image_url'>) {
  const fallbackImage = categoryImages[article.category] || categoryImages.economy;

  if (!article.image_url) {
    return fallbackImage;
  }

  if (article.image_url.startsWith('/')) {
    return article.image_url;
  }

  try {
    const imageUrl = new URL(article.image_url);
    return imageUrl.hostname === 'images.unsplash.com' ? article.image_url : fallbackImage;
  } catch {
    return fallbackImage;
  }
}

export const defaultArticles: Article[] = [
  {
    id: 'seed-1',
    title_en: 'Korea sharpens its AI ambitions as chips and policy converge',
    title_ja: '韓国、半導体と政策でAI戦略を加速',
    body_en:
      'South Korea is moving to align industrial policy, semiconductor investment, and artificial intelligence adoption as global demand for compute infrastructure accelerates. The effort reflects a wider race among advanced economies to secure model development capacity, cloud infrastructure, and high-end memory supply chains. For global readers, Korea is important because it sits at the center of the memory-chip market and has an export economy that responds quickly to technology cycles.',
    body_ja:
      '韓国は、計算インフラへの世界的な需要が高まるなか、産業政策、半導体投資、人工知能の導入を一体的に進めようとしている。この動きは、先進国がモデル開発能力、クラウド基盤、高性能メモリーの供給網を確保しようとする競争の一部だ。韓国はメモリーチップ市場の中心にあり、技術サイクルに敏感な輸出経済を持つため、世界の読者にとって重要な観測対象となっている。',
    summary_en:
      'Korea is aligning AI policy and chip investment as global compute demand accelerates.',
    summary_ja:
      '韓国は世界的な計算需要の拡大に合わせ、AI政策と半導体投資を連動させている。',
    category: 'ai',
    source_url: 'https://example.com/korea-ai-chips',
    source_name: 'KAI Brief Desk',
    tags: ['AI', 'Semiconductors', 'Korea'],
    slug: 'korea-ai-chip-policy',
    image_url: null,
    published_at: new Date().toISOString(),
    is_published: true
  },
  {
    id: 'seed-2',
    title_en: 'Export recovery keeps Korea watchers focused on memory prices',
    title_ja: '輸出回復で韓国市場の焦点はメモリー価格に',
    body_en:
      'Korean export data continues to draw attention from investors tracking the turn in the global electronics cycle. Memory-chip pricing, China demand, and currency pressure remain central variables for companies and policymakers. A sustained recovery would support corporate earnings, but it also raises questions about inflation, rates, and the resilience of global demand.',
    body_ja:
      '韓国の輸出統計は、世界の電子機器サイクルの転換点を追う投資家から引き続き注目されている。メモリーチップ価格、中国需要、為替圧力は、企業と政策当局にとって重要な変数だ。回復が続けば企業収益を支える一方、インフレ、金利、世界需要の底堅さをめぐる問いも浮上する。',
    summary_en:
      'Korea export momentum is tied closely to memory-chip pricing and global electronics demand.',
    summary_ja:
      '韓国の輸出回復は、メモリーチップ価格と世界の電子機器需要に大きく左右されている。',
    category: 'economy',
    source_url: 'https://example.com/korea-export-memory',
    source_name: 'KAI Brief Desk',
    tags: ['Exports', 'Memory', 'Economy'],
    slug: 'korea-export-memory-recovery',
    image_url: null,
    published_at: new Date(Date.now() - 3600_000).toISOString(),
    is_published: true
  }
];

export async function getArticles(
  category?: Category,
  limit = 12,
  offset = 0
): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return category
      ? defaultArticles.filter((article) => article.category === category)
      : defaultArticles;
  }

  return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  const article = error ? defaultArticles.find((item) => item.slug === slug) : data;

  if (!article) {
    notFound();
  }

  return article as Article;
}

export async function getArticleCount(category: Category) {
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .eq('category', category);

  if (error || count === null) {
    return defaultArticles.filter((article) => article.category === category).length;
  }

  return count;
}

export function formatRelativeTime(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'Just now';
}
