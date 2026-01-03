import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Header } from '@/components/ui/header-on-page';
import { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Renaud Fradin - Développeur Full-Stack - Renaud Fradin Photo',
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

export default async function About() {
  const t = await getTranslations('AboutPage');
  const locale = await getLocale();
  return (
    <AnimationWrapper>
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
        subtitle2={t('subtitle2')}
      ></Header>
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-6 mt-6">
          <Link
            href="https://www.linkedin.com/in/renaudfradin/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            {t('linkedin')}
          </Link>
          <Link
            href="https://github.com/Renaudfradin"
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            {t('github')}
          </Link>
          <Link
            href="https://renaudfradin.vercel.app/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            {t('portfolio')}
          </Link>
           <Link
            href={`/${locale}/legal`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('legal')}
          </Link>
        </div>
      </div>
    </AnimationWrapper>
  );
}
