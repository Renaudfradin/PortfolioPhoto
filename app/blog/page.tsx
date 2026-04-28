import { Metadata } from 'next';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { callApi } from '@/lib/api';
import type { Article, ArticlesApiResponse } from '@/lib/types/article';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Blog Renaud Fradin - Développeur Full-Stack - Renaud Fradin Photo',
  keywords: [
    'Renaud Fradin',
    'Développeur Full-Stack',
    'Portfolio',
    'Renaud Fradin Photo',
    'Blog',
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

function extractArticles(data: ArticlesApiResponse): Article[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
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

export default async function Blog() {
  const locale = await getLocale();
  const data = await callApi<ArticlesApiResponse>('/api/articles');
  const articles = extractArticles(data);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <div className="mt-6 space-y-3">
        {articles.map((article, index) => {
          const slug = article.slug;
          if (!slug) return null;
          const title = article.title ?? slug;
          return (
            <Link
              key={String(article.id ?? slug ?? index)}
              href={`/${locale}/blog/${slug}`}
              className="block rounded-md border px-4 py-3 hover:bg-muted transition-colors"
            >
              <div className="font-medium">{title}</div>
              {article.excerpt ? (
                <div className="text-sm text-muted-foreground mt-1">
                  {article.excerpt}
                </div>
              ) : null}
            </Link>
          );
        })}

        {articles.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucun article.</div>
        ) : null}
      </div>
    </div>
  );
}
