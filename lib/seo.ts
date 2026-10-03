import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';
import { defaultLocale, locales, type Locale } from '@/i18n';

export const SITE_NAME = 'Renaud Fradin';
export const SITE_AUTHOR = 'Renaud Fradin';

export const DEFAULT_OG_IMAGE_PATH = '/og.jpg';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/renaudfradin/';
export const GITHUB_URL = 'https://github.com/Renaudfradin';
export const DEFAULT_INSTAGRAM_URL =
  'https://www.instagram.com/renaud_photographer/';

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
  return 'https://renaudfradinphoto.vercel.app';
}

export function getInstagramUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEFAULT_INSTAGRAM_URL;
}

export function getSocialSameAs(): string[] {
  return [LINKEDIN_URL, GITHUB_URL, getInstagramUrl()];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function resolveLocale(locale?: string): string {
  if (locale && isLocale(locale)) return locale;
  return defaultLocale;
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
  const normalized =
    path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
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
  const normalized =
    path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function getDefaultOgImageUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_OG_IMAGE_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
}

export function resolveMediaUrl(
  image?: string | StaticImageData,
): string | undefined {
  if (!image) return undefined;

  if (typeof image === 'object' && image !== null && 'src' in image) {
    const src = image.src;
    if (typeof src === 'string' && src.startsWith('http')) return src;
    if (typeof src === 'string') return absoluteUrl(src);
    return undefined;
  }

  if (typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(
      /\/$/,
      '',
    );
    if (apiBase && image.startsWith('/')) {
      return `${apiBase}${image}`;
    }
    return absoluteUrl(image);
  }

  return undefined;
}

type PageMetadataInput = {
  path: string;
  locale: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
};

export function buildPageMetadata({
  path,
  locale,
  title,
  description,
  keywords,
  image,
}: PageMetadataInput): Metadata {
  const normalizedPath = path.startsWith('/') || path === '' ? path : `/${path}`;
  const canonical = `/${locale}${normalizedPath}`;
  const ogImage = image ?? getDefaultOgImageUrl();

  return {
    title,
    description,
    keywords,
    authors: [{ name: SITE_AUTHOR }],
    alternates: localeAlternates(normalizedPath, locale),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: toOgLocale(locale),
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

type PhotoMetadataInput = {
  name: string;
  description: string;
  slug: string;
  locale: string;
  image?: string | StaticImageData;
  keywords?: string[];
};

export function buildPhotoMetadata({
  name,
  description,
  slug,
  locale,
  image,
  keywords,
}: PhotoMetadataInput): Metadata {
  const pageTitle = `${name} — ${SITE_NAME}`;
  const path = `/photography/${slug}`;
  const ogImage =
    resolveMediaUrl(image) ?? getDefaultOgImageUrl();

  return buildPageMetadata({
    path,
    locale,
    title: pageTitle,
    description,
    keywords,
    image: ogImage,
  });
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
  const ogImage = image ?? getDefaultOgImageUrl();

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
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
};

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

  return buildPageMetadata({
    path,
    locale,
    title,
    description,
    keywords: [
      SITE_AUTHOR,
      'Blog',
      'Photographie',
      'Photography',
      'Portfolio',
    ],
  });
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
      sameAs: getSocialSameAs(),
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

type PersonJsonLdInput = {
  locale: string;
  description?: string;
};

export function buildPersonJsonLd({ locale, description }: PersonJsonLdInput) {
  const url = absoluteUrl(`/${locale}/about`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_AUTHOR,
    url,
    description,
    image: getDefaultOgImageUrl(),
    sameAs: getSocialSameAs(),
    jobTitle: 'Photographer',
  };
}

type WebSiteJsonLdInput = {
  locale: string;
  description?: string;
};

export function buildWebSiteJsonLd({ locale, description }: WebSiteJsonLdInput) {
  const url = absoluteUrl(`/${locale}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url,
    description,
    inLanguage: toOgLocale(locale),
    publisher: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      sameAs: getSocialSameAs(),
    },
  };
}
