import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { callApi } from '@/lib/api';
import {
  articleSlugs,
  blocksToPlainText,
  extractArticle,
  extractArticles,
  normalizeBlocks,
} from '@/lib/articles';
import { articleCacheTags, CACHE_TAGS } from '@/lib/cache-tags';
import { defaultLocale, locales } from '@/i18n';
import { sanitizeHtml } from '@/lib/sanitize-html';
import {
  buildArticleJsonLd,
  buildArticleMetadata,
  isLocale,
} from '@/lib/seo';
import type {
  Article,
  ArticleApiResponse,
  ArticleContentBlock,
  ArticlesApiResponse,
} from '@/lib/types/article';

type Props = {
  params: Promise<{ slug: string; locale?: string }>;
};

function resolveLocale(locale?: string): string {
  if (locale && isLocale(locale)) return locale;
  return defaultLocale;
}

function ArticleContentBlocks({ blocks }: { blocks: ArticleContentBlock[] }) {
  if (blocks.length === 0) return null;

  return (
    <div className="mt-8 space-y-4 leading-7 prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === 'heading') {
          // Keep a single page-level <h1>; downgrade CMS h1 blocks.
          const rawLevel =
            typeof block.level === 'string' ? block.level : 'h2';
          const level = rawLevel === 'h1' ? 'h2' : rawLevel;
          const HeadingTag = (
            ['h2', 'h3', 'h4', 'h5', 'h6'].includes(level) ? level : 'h2'
          ) as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

          return <HeadingTag key={key}>{block.content}</HeadingTag>;
        }

        if (block.type === 'text') {
          return (
            <p key={key} className="whitespace-pre-wrap">
              {block.content}
            </p>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <div
              key={key}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  try {
    const data = await callApi<ArticleApiResponse>(`/api/article/${slug}`, {
      tags: articleCacheTags(slug),
    });
    const article = extractArticle(data);

    if (!article) {
      return { title: 'Article non trouvé' };
    }

    const title = article.title ?? slug;
    const blocks = normalizeBlocks(article.content);
    const plainText = blocksToPlainText(blocks).slice(0, 160);
    const description =
      article.description ?? article.excerpt ?? (plainText || undefined);
    const publishedTime = article.date ?? article.created_at;
    const modifiedTime = article.updated_at ?? publishedTime;

    return buildArticleMetadata({
      title,
      description,
      slug,
      locale,
      image: article.image,
      publishedTime,
      modifiedTime,
    });
  } catch {
    return { title: 'Article non trouvé' };
  }
}

export async function generateStaticParams() {
  try {
    const data = await callApi<ArticlesApiResponse>('/api/articles', {
      tags: [CACHE_TAGS.articles],
      enablePerformanceLog: false,
    });
    const slugs = articleSlugs(extractArticles(data));

    return locales.flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug })),
    );
  } catch {
    return [];
  }
}

export default async function BlogSlug({ params }: Props) {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  let article: Article | null = null;

  try {
    const data = await callApi<ArticleApiResponse>(`/api/article/${slug}`, {
      tags: articleCacheTags(slug),
    });
    article = extractArticle(data);
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const title = article.title ?? slug;
  const date = article.date ?? article.created_at;
  const modifiedTime = article.updated_at ?? date;
  const blocks = normalizeBlocks(article.content);
  const plainText = blocksToPlainText(blocks).slice(0, 160);
  const description =
    article.description ?? article.excerpt ?? (plainText || undefined);
  const jsonLd = buildArticleJsonLd({
    title,
    description,
    slug,
    locale,
    image: article.image,
    publishedTime: date,
    modifiedTime,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {date ? (
        <div className="mt-2 text-sm text-muted-foreground">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      ) : null}
      {article.image ? (
        <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={article.image}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      ) : null}
      {article.excerpt ? (
        <p className="mt-6 text-muted-foreground">{article.excerpt}</p>
      ) : null}
      <ArticleContentBlocks blocks={blocks} />
    </div>
  );
}
