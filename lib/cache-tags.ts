import { locales } from '@/i18n';

export const CACHE_TAGS = {
  articles: 'articles',
  article: (slug: string) => `article:${slug}`,
  photographies: 'photographies',
  photography: (slug: string) => `photography:${slug}`,
} as const;

export function articleCacheTags(slug: string): string[] {
  return [CACHE_TAGS.articles, CACHE_TAGS.article(slug)];
}

export function articlePaths(slug: string): string[] {
  return locales.flatMap((locale) => [
    `/${locale}/blog/${slug}`,
    `/${locale}/blog`,
  ]);
}
