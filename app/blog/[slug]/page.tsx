import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { callApi } from '@/lib/api';
import { articleCacheTags } from '@/lib/cache-tags';
import { sanitizeHtml } from '@/lib/sanitize-html';
import type {
  Article,
  ArticleApiResponse,
  ArticleContentBlock,
} from '@/lib/types/article';

type Props = {
  params: Promise<{ slug: string }>;
};

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function extractArticle(data: ArticleApiResponse | null): Article | null {
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeBlocks(
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

function blocksToPlainText(blocks: ArticleContentBlock[]): string {
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

function ArticleContentBlocks({ blocks }: { blocks: ArticleContentBlock[] }) {
  if (blocks.length === 0) return null;

  return (
    <div className="mt-8 space-y-4 leading-7 prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === 'heading') {
          const level =
            typeof block.level === 'string' && HEADING_TAGS.has(block.level)
              ? block.level
              : 'h2';
          const HeadingTag = level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

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

        // Ignore unknown block types instead of rendering raw HTML
        return null;
      })}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

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

    return {
      title: `${title} - Blog`,
      description,
    };
  } catch {
    return { title: 'Article non trouvé' };
  }
}

export async function generateStaticParams() {
  return [];
}

export default async function BlogSlug({ params }: Props) {
  const { slug } = await params;
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
  const blocks = normalizeBlocks(article.content);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {date ? (
        <div className="mt-2 text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
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
