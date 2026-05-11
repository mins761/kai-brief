import type { MetadataRoute } from 'next';
import { categories, defaultArticles } from '@/lib/articles';

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
  const articleRoutes = defaultArticles.map((article) => `/article/${article.slug}`);
  const japaneseArticleRoutes = defaultArticles.map((article) => `/ja/article/${article.slug}`);

  return [...staticRoutes, ...articleRoutes, ...japaneseArticleRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));
}
