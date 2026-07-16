import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import { callApi } from '@/lib/api';
import { CACHE_TAGS } from '@/lib/cache-tags';
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
  let articles: Article[] = [];
  let apiError = false;

  try {
    const data = await callApi<ArticlesApiResponse>('/api/articles', {
      tags: [CACHE_TAGS.articles],
    });
    articles = extractArticles(data);
  } catch {
    apiError = true;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        {articles.map((article, index) => {
          const slug = article.slug;
          if (!slug) return null;
          const title = article.title ?? slug;
          const href = `/${locale}/blog/${slug}`;
          return (
            <article
              key={String(article.id ?? slug ?? index)}
              className="space-y-4"
            >
              <Link
                href={href}
                className="block overflow-hidden rounded-lg border"
              >
                <div className="relative aspect-[16/10] w-full bg-muted p-2">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : null}
                </div>
              </Link>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold leading-snug">{title}</h2>
                {article.excerpt ? (
                  <p className="text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}

        {apiError ? (
          <div className="text-sm text-muted-foreground">
            Impossible de charger les articles. Vérifiez que l&apos;API est
            démarrée ({process.env.NEXT_PUBLIC_API_BASE_URL}).
          </div>
        ) : null}
        {!apiError && articles.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucun article.</div>
        ) : null}
      </div>
    </div>
  );
}
