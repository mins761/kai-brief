import type { MetadataRoute } from 'next';
import { categories, defaultArticles } from '@/lib/articles';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kai-brief.vercel.app';
  const staticRoutes = [
    '',
    '/ja',
    '/about',
    '/privacy',
    '/contact',
    ...categories.map((item) => `/${item}`),
    ...categories.map((item) => `/ja/${item}`)
  ];
  const { data } = await supabase
    .from('articles')
    .select('slug,published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(500);

  const articles = data?.length ? data : defaultArticles;
  const articleRoutes = articles.map((article) => ({
    route: `/article/${article.slug}`,
    lastModified: new Date(article.published_at)
  }));
  const japaneseArticleRoutes = articles.map((article) => ({
    route: `/ja/article/${article.slug}`,
    lastModified: new Date(article.published_at)
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date()
    })),
    ...articleRoutes.map((item) => ({
      url: `${siteUrl}${item.route}`,
      lastModified: item.lastModified
    })),
    ...japaneseArticleRoutes.map((item) => ({
      url: `${siteUrl}${item.route}`,
      lastModified: item.lastModified
    }))
  ];
}
