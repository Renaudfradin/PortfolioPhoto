import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { callApi } from '@/lib/api';
import { articleSlugs, extractArticles } from '@/lib/articles';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getSiteUrl } from '@/lib/seo';
import type { ArticlesApiResponse } from '@/lib/types/article';

const STATIC_PATHS = ['', '/blog', '/photography', '/about', '/legal'] as const;

async function fetchArticleSlugs(): Promise<string[]> {
  try {
    const data = await callApi<ArticlesApiResponse>('/api/articles', {
      tags: [CACHE_TAGS.articles],
      enablePerformanceLog: false,
    });
    return articleSlugs(extractArticles(data));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const slugs = await fetchArticleSlugs();
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: path === '/blog' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : path === '/blog' ? 0.8 : 0.7,
      });
    }

    for (const slug of slugs) {
      entries.push({
        url: `${siteUrl}/${locale}/blog/${slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
