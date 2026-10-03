import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Header } from '@/components/ui/header-on-page';
import { Metadata } from 'next';
import { callApi } from '@/lib/api';
import { extractPhotos } from '@/lib/photography';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { buildPageMetadata, resolveLocale } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import type { PhotographieType } from '@/lib/types/photography';
import PhotographyGallery from '@/components/photography-gallery';

type Props = {
  params: Promise<{ locale?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const t = await getTranslations({ locale, namespace: 'Seo' });

  return buildPageMetadata({
    path: '/photography',
    locale,
    title: t('photographyTitle'),
    description: t('photographyDescription'),
    keywords: t('photographyKeywords').split(',').map((k) => k.trim()),
  });
}

export default async function Photography() {
  const t = await getTranslations('PhotographyPage');
  let photos: PhotographieType[] = [];
  let apiError = false;

  try {
    const data = await callApi<unknown>('/api/photographies', {
      tags: [CACHE_TAGS.photographies],
    });
    photos = extractPhotos(data);
  } catch {
    apiError = true;
  }

  return (
    <AnimationWrapper>
      <div>
        <Header title={t('title')} subtitle={t('subtitle')} />
        <section className="py-24 px-6">
          {apiError ? (
            <p className="text-sm text-muted-foreground">{t('error')}</p>
          ) : (
            <PhotographyGallery photos={photos} />
          )}
        </section>
      </div>
    </AnimationWrapper>
  );
}
