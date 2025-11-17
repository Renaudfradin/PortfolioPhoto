import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PhotoIcon, ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import AnimationWrapper from '@/components/ui/animation-wrapper';

export default function NotFound() {
  return (
    <AnimationWrapper>
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <PhotoIcon className="w-24 h-24 mx-auto text-zinc-600" />

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Photo non trouvée</h1>
            <p className="text-zinc-400">
              La photo que vous recherchez n'existe pas ou a été supprimée.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/photography">
              <Button className="w-full">
                <ArrowLongLeftIcon className="w-4 h-4 mr-2" />
                Retour à la galerie
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
