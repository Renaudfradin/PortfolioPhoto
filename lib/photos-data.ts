import img35mn_003 from '@/app/assets/img/35mn/00002070-003.jpg';
import img35mn_013 from '@/app/assets/img/35mn/00002070-013.jpg';
import img35mn_015 from '@/app/assets/img/35mn/00002070-015.jpg';
import img35mn_002 from '@/app/assets/img/35mn/00002071-002.jpg';
import img35mn_003_2 from '@/app/assets/img/35mn/00002071-003.jpg';
import img35mn_018 from '@/app/assets/img/35mn/00002071-018.jpg';
import img35mn_023 from '@/app/assets/img/35mn/00002071-023.jpg';
import img110mn_001 from '@/app/assets/img/110mn/001.jpg';
import img110mn_006 from '@/app/assets/img/110mn/006.jpg';
import img110mn_011 from '@/app/assets/img/110mn/011.jpg';
import img110mn_019 from '@/app/assets/img/110mn/019.jpg';

export interface PhotoData {
  src: any;
  alt: string;
  series: string;
  date: string;
  id: string;
}

export const photos: PhotoData[] = [
  {
    src: img35mn_003,
    alt: 'Photographie argentique 35mm - 00002070-003',
    series: '35mm',
    date: '2025',
    id: '35mn-003',
  },
  {
    src: img35mn_013,
    alt: 'Photographie argentique 35mm - 00002070-013',
    series: '35mm',
    date: '2025',
    id: '35mn-013',
  },
  {
    src: img35mn_015,
    alt: 'Photographie argentique 35mm - 00002070-015',
    series: '35mm',
    date: '2025',
    id: '35mn-015',
  },

  {
    src: img35mn_003_2,
    alt: 'Photographie argentique 35mm - 00002071-003',
    series: '35mm',
    date: '2025',
    id: '35mn-003-2',
  },
  {
    src: img35mn_018,
    alt: 'Photographie argentique 35mm - 00002071-018',
    series: '35mm',
    date: '2025',
    id: '35mn-018',
  },
  {
    src: img35mn_023,
    alt: 'Photographie argentique 35mm - 00002071-023',
    series: '35mm',
    date: '2025',
    id: '35mn-023',
  },
  {
    src: img35mn_002,
    alt: 'Photographie argentique 35mm - 00002071-002',
    series: '35mm',
    date: '2025',
    id: '35mn-002',
  },
  {
    src: img110mn_001,
    alt: 'Photographie argentique 110mm - 001',
    series: '110mm',
    date: '2025',
    id: '110mn-001',
  },
  {
    src: img110mn_006,
    alt: 'Photographie argentique 110mm - 006',
    series: '110mm',
    date: '2025',
    id: '110mn-006',
  },
  {
    src: img110mn_011,
    alt: 'Photographie argentique 110mm - 011',
    series: '110mm',
    date: '2025',
    id: '110mn-011',
  },
  {
    src: img110mn_019,
    alt: 'Photographie argentique 110mm - 019',
    series: '110mm',
    date: '2025',
    id: '110mn-019',
  },
];
