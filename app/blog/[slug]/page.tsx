import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { callApi } from '@/lib/api';
import type { Article } from '@/lib/types/article';

type Props = {
  params: Promise<{ slug: string }>;
};

function extractArticle(data: unknown): Article | null {
  if (!data) return null;

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidate =
      record.data ??
      record.article ??
      record.item ??
      record.result ??
      record;

    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return candidate as Article;
    }
  }

  return null;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { slug } = await params;
  const data = await callApi<unknown>(`/api/article/${slug}`);
  const article = extractArticle(data);

  if (!article) {
    return {
      title: 'Article non trouvé',
    };
  }

  const title = article.title ?? slug;
  const description =
    article.description ??
    article.excerpt ??
    (typeof article.content === 'string' ? article.content.slice(0, 160) : undefined);

  return {
    title: `${title} - Blog`,
    description,
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function BlogSlug({ params }: Props) {
  const { slug } = await params;
  const data = await callApi<unknown>(`/api/article/${slug}`);
  const article = extractArticle(data);

  if (!article) {
    notFound();
  }

  const title = article.title ?? slug;
  const date = article.date;
  const content = typeof article.content === 'string' ? article.content : null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {date ? (
        <div className="mt-2 text-sm text-muted-foreground">{date}</div>
      ) : null}
      {article.excerpt ? (
        <p className="mt-6 text-muted-foreground">{article.excerpt}</p>
      ) : null}
      {content ? (
        <div
          className="mt-8 leading-7 prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : null}
    </div>
  );
}