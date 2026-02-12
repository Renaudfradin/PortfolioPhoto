import ImageContainer from '@/components/image-container';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Header } from '@/components/ui/header-on-page';
import { Metadata } from 'next';
import { callApi } from '@/lib/api';
import { getTranslations } from 'next-intl/server';
import type { PhotographieType } from '@/lib/types/photography';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Photography',
  description:
    'Photography Renaud Fradin - Développeur Full-Stack - Renaud Fradin Photo',
  keywords: [
    'Renaud Fradin',
    'Développeur Full-Stack',
    'Portfolio',
    'Renaud Fradin Photo',
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

function extractPhotos(data: unknown): PhotographieType[] {
  if (Array.isArray(data)) {
    return data as PhotographieType[];
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidates = [
      record.data,
      record.photographies,
      record.photography,
      record.items,
      record.results,
    ];

    const arr = candidates.find(Array.isArray);
    if (arr && Array.isArray(arr)) {
      return arr as PhotographieType[];
    }
  }

  return [];
}

export default async function Photography() {
  const t = await getTranslations('PhotographyPage');
  const data = await callApi<unknown>('/api/photographies');
  const photos = extractPhotos(data);
  return (
    <AnimationWrapper>
      <div>
        <Header title={t('title')} subtitle={t('subtitle')} />
        <section className="py-24 px-6">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <ImageContainer key={index} photo={photo} index={index} />
            ))}
          </div>
        </section>
      </div>
    </AnimationWrapper>
  );
}
