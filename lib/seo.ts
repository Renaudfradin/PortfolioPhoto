import type { Metadata } from 'next';
import { defaultLocale, locales, type Locale } from '@/i18n';

export const SITE_NAME = 'Renaud Fradin';
export const SITE_AUTHOR = 'Renaud Fradin';

const OG_LOCALES: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  es: 'es_ES',
  de: 'de_DE',
  ru: 'ru_RU',
  kg: 'ky_KG',
};

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  return 'https://renaudfradin.vercel.app';
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function toOgLocale(locale: string): string {
  if (isLocale(locale)) return OG_LOCALES[locale];
  return locale;
}

/** Path without locale prefix, e.g. `/blog` or `/blog/my-slug`. */
export function localeAlternates(
  path: string,
  locale: string,
): NonNullable<Metadata['alternates']> {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const languages: Record<string, string> = {
    'x-default': `/${defaultLocale}${normalized}`,
  };

  for (const l of locales) {
    languages[l] = `/${l}${normalized}`;
  }

  return {
    canonical: `/${locale}${normalized}`,
    languages,
  };
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

type ArticleMetadataInput = {
  title: string;
  description?: string;
  slug: string;
  locale: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildArticleMetadata({
  title,
  description,
  slug,
  locale,
  image,
  publishedTime,
  modifiedTime,
}: ArticleMetadataInput): Metadata {
  const pageTitle = `${title} - Blog`;
  const path = `/blog/${slug}`;
  const canonical = `/${locale}${path}`;

  return {
    title: pageTitle,
    description,
    authors: [{ name: SITE_AUTHOR }],
    alternates: localeAlternates(path, locale),
    openGraph: {
      title: pageTitle,
      description,
      type: 'article',
      locale: toOgLocale(locale),
      url: canonical,
      siteName: SITE_NAME,
      publishedTime,
      modifiedTime,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

type BlogIndexMetadataInput = {
  title: string;
  description: string;
  locale: string;
};

export function buildBlogIndexMetadata({
  title,
  description,
  locale,
}: BlogIndexMetadataInput): Metadata {
  const path = '/blog';
  const canonical = `/${locale}${path}`;

  return {
    title,
    description,
    keywords: [
      SITE_AUTHOR,
      'Blog',
      'Photographie',
      'Photography',
      'Portfolio',
    ],
    alternates: localeAlternates(path, locale),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: toOgLocale(locale),
      url: canonical,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

type ArticleJsonLdInput = {
  title: string;
  description?: string;
  slug: string;
  locale: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildArticleJsonLd({
  title,
  description,
  slug,
  locale,
  image,
  publishedTime,
  modifiedTime,
}: ArticleJsonLdInput) {
  const url = absoluteUrl(`/${locale}/blog/${slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: getSiteUrl(),
    },
    publisher: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: getSiteUrl(),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
  };
}
