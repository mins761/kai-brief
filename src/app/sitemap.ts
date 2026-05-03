import type { MetadataRoute } from 'next';
import { categories, defaultArticles } from '@/lib/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kai-brief.example.com';
  const staticRoutes = ['', '/about', '/privacy', '/contact', ...categories.map((item) => `/${item}`)];
  const articleRoutes = defaultArticles.map((article) => `/article/${article.slug}`);

  return [...staticRoutes, ...articleRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));
}
