import Image from 'next/image';
import { Metadata } from 'next';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import { callApi } from '@/lib/api';
import { photographyCacheTags } from '@/lib/cache-tags';
import { extractPhoto } from '@/lib/photography';
import { buildPhotoMetadata, resolveLocale } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ slug: string; locale?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const data = await callApi<unknown>(`/api/photography/${slug}`, {
    tags: photographyCacheTags(slug),
  });
  const photo = extractPhoto(data);
  const name = photo?.name ?? 'Photo';
  const series = photo?.series;
  const date = photo?.date;

  if (!photo) {
    return {
      title: 'Photo non trouvée',
    };
  }

  const description = `${name}${series ? ` — ${series}` : ''}${date ? ` (${date})` : ''} — Renaud Fradin`;

  return buildPhotoMetadata({
    name,
    description,
    slug,
    locale,
    image: photo.image,
    keywords: ['Renaud Fradin', 'Photography', 'Photographie', series].filter(
      (k): k is string => typeof k === 'string' && k.length > 0,
    ),
  });
}

export async function generateStaticParams() {
  return [];
}

export default async function Photographie({ params }: Props) {
  const { slug } = await params;
  const data = await callApi<unknown>(`/api/photography/${slug}`, {
    tags: photographyCacheTags(slug),
  });
  const photo = extractPhoto(data);
  const t = await getTranslations('PhotographyPage');

  if (!photo) {
    notFound();
  }

  const name = photo.name ?? '';

  return (
    <AnimationWrapper>
      <div className="text-white">
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-2">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={photo.image}
                    alt={name}
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
                  <div className="space-y-2 text-muted-foreground">
                    {photo.series ? (
                      <p>
                        <span className="text-muted-foreground">
                          {t('series')}:
                        </span>{' '}
                        {photo.series}mm
                      </p>
                    ) : null}
                    {photo.date ? (
                      <p>
                        <span className="text-muted-foreground">
                          {t('date')}:
                        </span>{' '}
                        {photo.date}
                      </p>
                    ) : null}
                    {photo.city ? (
                      <p>
                        <span className="text-muted-foreground">
                          {t('city')}:
                        </span>{' '}
                        {photo.city}
                      </p>
                    ) : null}
                    {photo.camera_name ? (
                      <p>
                        <span className="text-muted-foreground">
                          {t('camera')}:
                        </span>{' '}
                        {photo.camera_name}
                      </p>
                    ) : null}
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
