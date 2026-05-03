import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Article, Category } from '@/types';

export const categories: Category[] = ['economy', 'ai', 'policy', 'market'];

export const categoryLabels: Record<Category, string> = {
  economy: 'Economy',
  ai: 'AI',
  policy: 'Policy',
  market: 'Market'
};

export const categoryColors: Record<Category, string> = {
  economy: 'bg-blue-100 text-blue-700',
  ai: 'bg-cyan-100 text-cyan-700',
  policy: 'bg-green-100 text-green-700',
  market: 'bg-orange-100 text-orange-700'
};

export const categoryImages: Record<Category, string> = {
  economy: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
  ai: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400',
  policy: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400',
  market: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'
};

export const defaultArticles: Article[] = [
  {
    id: 'seed-1',
    title_en: 'Korea sharpens its AI ambitions as chips and policy converge',
    body_en:
      'South Korea is moving to align industrial policy, semiconductor investment, and artificial intelligence adoption as global demand for compute infrastructure accelerates. The effort reflects a wider race among advanced economies to secure model development capacity, cloud infrastructure, and high-end memory supply chains. For global readers, Korea is important because it sits at the center of the memory-chip market and has an export economy that responds quickly to technology cycles.',
    summary_en:
      'Korea is aligning AI policy and chip investment as global compute demand accelerates.',
    category: 'ai',
    source_url: 'https://example.com/korea-ai-chips',
    source_name: 'KAI Brief Desk',
    tags: ['AI', 'Semiconductors', 'Korea'],
    slug: 'korea-ai-chip-policy',
    published_at: new Date().toISOString(),
    is_published: true
  },
  {
    id: 'seed-2',
    title_en: 'Export recovery keeps Korea watchers focused on memory prices',
    body_en:
      'Korean export data continues to draw attention from investors tracking the turn in the global electronics cycle. Memory-chip pricing, China demand, and currency pressure remain central variables for companies and policymakers. A sustained recovery would support corporate earnings, but it also raises questions about inflation, rates, and the resilience of global demand.',
    summary_en:
      'Korea export momentum is tied closely to memory-chip pricing and global electronics demand.',
    category: 'economy',
    source_url: 'https://example.com/korea-export-memory',
    source_name: 'KAI Brief Desk',
    tags: ['Exports', 'Memory', 'Economy'],
    slug: 'korea-export-memory-recovery',
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
