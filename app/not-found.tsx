import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PhotoIcon, ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Renaud Fradin - Not Found',
  description:
    'Explorez le monde à travers un regard photographique unique. Portfolio de Renaud Fradin',
};

export default function NotFound() {
  const t = useTranslations('NotFoundPage');
  return (
    <AnimationWrapper>
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <PhotoIcon className="w-24 h-24 mx-auto text-zinc-600" />

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{t('title')}</h1>
            <p className="text-zinc-400">{t('subtitle')}</p>
          </div>

          <div className="space-y-4">
            <Link href="/photography">
              <Button className="w-full">
                <ArrowLongLeftIcon className="w-4 h-4 mr-2" />
                {t('btn')}
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                {t('btn2')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
