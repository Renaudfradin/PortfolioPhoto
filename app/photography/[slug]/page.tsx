import Image from 'next/image';
import { Metadata, ResolvingMetadata } from 'next';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import { photos } from '@/lib/photos-data';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const photo = photos.find((p) => p.id === slug);

  if (!photo) {
    return {
      title: 'Photo non trouvée',
    };
  }

  return {
    title: `${photo.alt} - Renaud Fradin Photography`,
    description: `${photo.alt} - Série ${photo.series} (${photo.date})`,
    keywords: ['Renaud Fradin', 'Photography', 'Photographie', photo.series],
  };
}

export async function generateStaticParams() {
  return photos.map((photo) => ({
    slug: photo.id,
  }));
}

export default async function Photographie({ params }: Props) {
  const { slug } = await params;
  const photo = photos.find((p) => p.id === slug);
  const t = await getTranslations('PhotographyPage');

  if (!photo) {
    notFound();
  }

  return (
    <AnimationWrapper>
      <div className="text-white">
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-2">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-contain rounded-lg"
                    quality={95}
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{photo.alt}</h1>
                  <div className="space-y-2 text-zinc-300">
                    <p>
                      <span className="text-zinc-500">{t('series')}:</span>{' '}
                      {photo.series}
                    </p>
                    <p>
                      <span className="text-zinc-500">{t('date')}:</span>{' '}
                      {photo.date}
                    </p>
                    <p>
                      <span className="text-zinc-500">{t('city')}:</span>{' '}
                      {photo.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
