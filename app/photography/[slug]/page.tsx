import Image from 'next/image';
import { Metadata, ResolvingMetadata } from 'next';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import { callApi } from '@/lib/api';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { PhotographieType } from '@/lib/types/photography';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

function extractPhoto(data: unknown): PhotographieType | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  const record = data as Record<string, unknown>;
  const candidate =
    record.data ??
    record.photo ??
    record.photography ??
    record.item ??
    record.result;

  if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
    return candidate as unknown as PhotographieType;
  }

  return record as unknown as PhotographieType;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const data = await callApi<unknown>(`/api/photography/${slug}`);
  const photo = extractPhoto(data);
  const name = photo?.name ?? 'Photo';
  const series = photo?.series;
  const date = photo?.date;

  if (!photo) {
    return {
      title: 'Photo non trouvée',
    };
  }

  return {
    title: `${name} - Renaud Fradin Photography`,
    description: `${name}${series ? ` - Série ${series}` : ''}${date ? ` (${date})` : ''}`,
    keywords: ['Renaud Fradin', 'Photography', 'Photographie', series].filter(
      (k): k is string => typeof k === 'string' && k.length > 0,
    ),
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function Photographie({ params }: Props) {
  const { slug } = await params;
  const data = await callApi<unknown>(`/api/photography/${slug}`);
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
                  <h1 className="text-2xl font-bold mb-2">{name}</h1>
                  <div className="space-y-2 text-zinc-300">
                    {photo.series ? (
                      <p>
                        <span className="text-zinc-500">{t('series')}:</span>{' '}
                        {photo.series}mm
                      </p>
                    ) : null}
                    {photo.date ? (
                      <p>
                        <span className="text-zinc-500">{t('date')}:</span>{' '}
                        {photo.date}
                      </p>
                    ) : null}
                    {photo.city ? (
                      <p>
                        <span className="text-zinc-500">{t('city')}:</span>{' '}
                        {photo.city}
                      </p>
                    ) : null}
                    {photo.camera_name ? (
                      <p>
                        <span className="text-zinc-500">{t('camera')}:</span>{' '}
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
