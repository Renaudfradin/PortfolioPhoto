import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { callApi } from '@/lib/api';
import { extractArticles } from '@/lib/articles';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { buildBlogIndexMetadata, isLocale } from '@/lib/seo';
import { defaultLocale } from '@/i18n';
import type { Article, ArticlesApiResponse } from '@/lib/types/article';

type Props = {
  params: Promise<{ locale?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam)
    ? localeParam
    : (await getLocale().catch(() => defaultLocale));
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  return buildBlogIndexMetadata({
    title: t('title'),
    description: t('description'),
    locale,
  });
}

export default async function Blog({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale =
    localeParam && isLocale(localeParam)
      ? localeParam
      : await getLocale();
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
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
      <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : null}
                </div>
              </Link>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold leading-snug">
                  <Link href={href} className="hover:underline">
                    {title}
                  </Link>
                </h2>
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
          <div className="text-sm text-muted-foreground">{t('error')}</div>
        ) : null}
        {!apiError && articles.length === 0 ? (
          <div className="text-sm text-muted-foreground">{t('empty')}</div>
        ) : null}
      </div>
    </div>
  );
}
