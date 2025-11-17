import { AnimatedText } from '@/components/ui/animated-text';
import AnimationWrapper from '@/components/ui/animation-wrapper';
import ThemeToggle from '@/components/ui/my-theme-toggle';
import { Separator } from '@/components/ui/separator';
import MenuElements from '@/lib/menu-elements';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Explorez le monde à travers un regard photographique unique. Portfolio de Renaud Fradin',
};

export default function Home() {
  return (
    <AnimationWrapper>
      <div className="flex relative isolate items-center justify-center h-[calc(100vh-160px)] align-middle px-5">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight  sm:text-6xl">
            <AnimatedText
              text="Renaud Fradin"
              className="text-5xl font-bold tracking-tight  sm:text-6xl"
            />
          </h1>
          <blockquote>
            <p className="mt-6 text-md md:text-xl font-bold md:font-normal  underline-offset-4	 leading-8">
              chaque regard révèle un univers unique.
            </p>
          </blockquote>
          <p className="my-6 mb-12 text-sm md:leading-8 text-muted-foreground">
            &quot;capturer l&apos;essence de l&apos;instant, révéler
            l&apos;invisible&quot;
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
