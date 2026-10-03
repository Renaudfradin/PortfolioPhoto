import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Header } from '@/components/ui/header-on-page';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  buildPageMetadata,
  buildPersonJsonLd,
  getInstagramUrl,
  GITHUB_URL,
  LINKEDIN_URL,
  resolveLocale,
} from '@/lib/seo';

type Props = {
  params: Promise<{ locale?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const t = await getTranslations({ locale, namespace: 'Seo' });

  return buildPageMetadata({
    path: '/about',
    locale,
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    keywords: t('aboutKeywords').split(',').map((k) => k.trim()),
  });
}

export default async function About({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  const tSeo = await getTranslations({ locale, namespace: 'Seo' });
  const jsonLd = buildPersonJsonLd({
    locale,
    description: tSeo('aboutDescription'),
  });

  return (
    <AnimationWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
        subtitle2={t('subtitle2')}
        children2={t('children')}
      ></Header>
      <div className="text-center space-y-4">
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <Link
            href={LINKEDIN_URL}
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('linkedin')}
          </Link>
          <Link
            href={GITHUB_URL}
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('github')}
          </Link>
          <Link
            href={getInstagramUrl()}
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="me noopener noreferrer"
          >
            {t('instagram')}
          </Link>
          <Link
            href={`/${locale}/photography`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('gallery')}
          </Link>
          <Link
            href={`/${locale}/legal`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('legal')}
          </Link>
        </div>
      </div>
    </AnimationWrapper>
  );
}
