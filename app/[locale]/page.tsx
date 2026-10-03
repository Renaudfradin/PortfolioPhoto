import { AnimatedText } from '@/components/ui/animated-text';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import ThemeToggle from '@/components/ui/my-theme-toggle';
import { Separator } from '@/components/ui/separator';
import MenuElements from '@/lib/menu-elements';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  buildPageMetadata,
  buildWebSiteJsonLd,
  resolveLocale,
} from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const t = await getTranslations({ locale, namespace: 'Seo' });

  return buildPageMetadata({
    path: '',
    locale,
    title: t('homeTitle'),
    description: t('homeDescription'),
    keywords: t('homeKeywords').split(',').map((k) => k.trim()),
  });
}

export default async function Home({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const t = await getTranslations({ locale, namespace: 'IndexPage' });
  const tSeo = await getTranslations({ locale, namespace: 'Seo' });
  const jsonLd = buildWebSiteJsonLd({
    locale,
    description: tSeo('homeDescription'),
  });

  return (
    <AnimationWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex relative isolate items-center justify-center min-h-[calc(100vh-160px)] align-middle px-5 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight  sm:text-6xl">
            <AnimatedText
              text="Renaud Fradin"
              className="text-5xl font-bold tracking-tight  sm:text-6xl"
            />
          </h1>
          <blockquote>
            <p className="mt-6 text-md md:text-xl font-bold md:font-normal  underline-offset-4	 leading-8">
              {t('tagline')}
            </p>
          </blockquote>
          <p className="my-6 mb-8 text-sm md:leading-8 text-muted-foreground">
            {t('quote')}
          </p>
          <p className="mb-8 text-sm md:text-base leading-relaxed text-muted-foreground">
            {t('seoIntro')}
          </p>
          <Separator />
          <div className="pt-12 text-xs md:text-normal mb-5 lg:hidden opacity-60 ">
            <MenuElements className="md:p-5" />
          </div>
          <ThemeToggle className="test lg:hidden opacity-60" />
        </div>
      </div>
    </AnimationWrapper>
  );
}
