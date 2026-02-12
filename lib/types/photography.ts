import type { StaticImageData } from 'next/image';

export interface PhotoData {
  id: number;
  name: string;
  slug: string;
  image: string | StaticImageData;
  series?: string;
  date?: string;
  city?: string;
  camera_name?: string;
}

export type PhotographieType = PhotoData;
