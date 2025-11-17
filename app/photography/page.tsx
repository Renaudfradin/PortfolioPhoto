import ImageContainer from '@/components/image-container';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Header } from '@/components/ui/header-on-page';
import { Metadata } from 'next';
import { photos } from '@/lib/photos-data';

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

export default function Photography() {
  return (
    <AnimationWrapper>
      <div>
        <Header
          title="Photographie"
          subtitle="Un moment figé, capturé pour en dévoiler toute la beauté."
        />
        <section className="py-24 md:mx-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <ImageContainer key={index} photo={photo} index={index} />
            ))}
          </div>
        </section>
      </div>
    </AnimationWrapper>
  );
}
