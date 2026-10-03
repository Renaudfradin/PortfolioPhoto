import type { PhotographieType } from '@/lib/types/photography';

export function extractPhotos(data: unknown): PhotographieType[] {
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

export function photographySlugs(photos: PhotographieType[]): string[] {
  const slugs = new Set<string>();
  for (const photo of photos) {
    if (photo.slug?.trim()) {
      slugs.add(photo.slug.trim());
    }
  }
  return [...slugs];
}

export function extractPhoto(data: unknown): PhotographieType | null {
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
