'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoData } from '@/lib/photos-data';
import { useLocale } from 'next-intl';

interface ImageContainerProps {
  photo: PhotoData;
  index?: number;
}

export default function ImageContainer({
  photo,
  index = 0,
}: ImageContainerProps) {
  const locale = useLocale();
  return (
    <div className="w-full mb-6 break-inside-avoid">
      <div className="relative group group-hover:brightness-150 transition duration-200 group-hover:shadow-lg hover:shadow-indigo-500/90 border-2 border-zinc-500/20 hover:border-zinc-500/70 rounded-sm">
        <Link
          href={`/${locale}/photography/${photo.id}`}
          scroll={false}
          className="block"
        >
          <Image
            style={{ transform: 'translate3d(0, 0, 0)' }}
            src={photo.src}
            alt={photo.alt}
            width={720}
            height={480}
            quality={80}
            className="rounded-sm"
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
            placeholder="blur"
          />

          <div className="absolute rounded-b-sm top-0 mt-20 right-0 bottom-0 left-0 bg-gradient-to-b from-transparent to-zinc-900 opacity-80 md:opacity-0 group-hover:opacity-80"></div>
          <div>
            <p className="text-xs absolute bottom-1 text-white px-2 transition duration-200 opacity-70 md:opacity-0 group-hover:opacity-75">
              <span className="text-xs font-light line-clamp-1 block opacity-75">
                {photo.city}
              </span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
