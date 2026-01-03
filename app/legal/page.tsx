import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Renaud Fradin - Mentions légales',
  description:
    'Explorez le monde à travers un regard photographique unique. Portfolio de Renaud Fradin',
};

export default async function Legal() {
  const t = await getTranslations('LegalPage');
  return (
    <AnimationWrapper>
      <div className="min-h-screen text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">{t('title')}</h1>
            <p className="text-zinc-400">{t('subtitle')}</p>
          </div>

          <div className="mt-10 space-y-10">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">{t('title2')}</h2>
              <div className="text-zinc-300 space-y-1">
                <p>
                  <span className="font-medium">{t('subtitle3')} :</span> Renaud
                  Fradin
                </p>
                <p>
                  <span className="font-medium">{t('subtitle4')} :</span>{' '}
                  {t('status')}
                </p>
                <p>
                  <span className="font-medium">{t('subtitle5')} :</span>{' '}
                  renaudfradin@gmail.com
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">{t('title6')}</h2>
              <div className="text-zinc-300 space-y-1">
                <p>
                  <span className="font-medium">{t('subtitle6')} :</span> Vercel
                  Inc.
                </p>
                <p>
                  <span className="font-medium">{t('subtitle7')} :</span> 340 S
                  Lemon Ave #4133, Walnut, CA 91789, USA
                </p>
                <p>
                  <span className="font-medium">{t('subtitle8')} :</span>{' '}
                  <Link href="https://vercel.com">https://vercel.com</Link>
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">{t('title3')}</h2>
              <div className="text-zinc-300 space-y-2">
                <p>{t('subtitle9')}</p>
                <p>{t('subtitle10')}</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">{t('title4')}</h2>
              <div className="text-zinc-300 space-y-2">
                <p>{t('subtitle11')}</p>
                <p>{t('subtitle12')}</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">{t('title5')}</h2>
              <div className="text-zinc-300 space-y-2">
                <p>{t('subtitle13')}</p>
                <p>{t('subtitle14')}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
