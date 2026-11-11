import { defaultLocale, locales, type Locale } from '@/i18n';
import type {
  Article,
  ArticleApiResponse,
  ArticleContentBlock,
  ArticlesApiResponse,
} from '@/lib/types/article';

/**
 * API-Folio locales. Kyrgyz is `ky` on the API and `kg` on the site.
 */
const ARTICLE_API_LOCALES: Record<Locale, string> = {
  fr: 'fr',
  en: 'en',
  es: 'es',
  de: 'de',
  ru: 'ru',
  kg: 'ky',
};

export function toArticleApiLocale(locale?: string): string {
  if (locale && (locales as readonly string[]).includes(locale)) {
    return ARTICLE_API_LOCALES[locale as Locale];
  }

  return ARTICLE_API_LOCALES[defaultLocale];
}

export function articlesPath(locale?: string): string {
  return `/api/articles?lang=${toArticleApiLocale(locale)}`;
}

export function articlePath(slug: string, locale?: string): string {
  return `/api/article/${slug}?lang=${toArticleApiLocale(locale)}`;
}

export function extractArticles(data: ArticlesApiResponse | null): Article[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidates = [
      record.data,
      record.articles,
      record.items,
      record.results,
    ];

    const arr = candidates.find(Array.isArray);
    if (arr && Array.isArray(arr)) {
      return arr as Article[];
    }
  }

  return [];
}

export function extractArticle(
  data: ArticleApiResponse | null,
): Article | null {
  if (!data) return null;

  if (typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidate =
      record.data ?? record.article ?? record.item ?? record.result ?? record;

    if (
      candidate &&
      typeof candidate === 'object' &&
      !Array.isArray(candidate)
    ) {
      return candidate as Article;
    }
  }

  return null;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeBlocks(
  content: Article['content'],
): ArticleContentBlock[] {
  if (!content) return [];

  if (typeof content === 'string') {
    return [{ type: 'paragraph', content }];
  }

  if (!Array.isArray(content)) return [];

  return content.filter(
    (block): block is ArticleContentBlock =>
      !!block &&
      typeof block === 'object' &&
      typeof block.content === 'string' &&
      block.content.length > 0,
  );
}

export function blocksToPlainText(blocks: ArticleContentBlock[]): string {
  return blocks
    .map((block) =>
      block.type === 'paragraph' || block.type === 'heading'
        ? stripHtml(block.content)
        : block.content,
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function articleSlugs(articles: Article[]): string[] {
  return articles
    .map((article) => article.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}
