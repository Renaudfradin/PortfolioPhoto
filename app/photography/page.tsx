import ImageContainer from '@/components/image-container';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Header } from '@/components/ui/header-on-page';
import { Metadata } from 'next';
import { photos } from '@/lib/photos-data';
import { getTranslations } from 'next-intl/server';

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

export default async function Photography() {
  const t = await getTranslations('PhotographyPage');
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
