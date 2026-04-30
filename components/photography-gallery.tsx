'use client';

import { useMemo, useState } from 'react';
import ImageContainer from '@/components/image-container';
import type { PhotographieType } from '@/lib/types/photography';

interface PhotographyGalleryProps {
  photos: PhotographieType[];
}

export default function PhotographyGallery({
  photos,
}: PhotographyGalleryProps) {
  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const p of photos) {
      if (typeof p.city === 'string' && p.city.trim().length > 0) {
        set.add(p.city.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [photos]);

  const [selectedCity, setSelectedCity] = useState<string>('');

  const filtered = useMemo(() => {
    if (!selectedCity) return photos;
    return photos.filter((p) => (p.city ?? '').trim() === selectedCity);
  }, [photos, selectedCity]);

  return (
    <div>
      {cities.length > 0 ? (
        <div className="mb-10 rounded-lg border bg-card/60 backdrop-blur px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Filtrer</div>
              <div className="text-xs text-muted-foreground">
                Affichage {filtered.length} sur {photos.length}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label htmlFor="city" className="text-sm text-muted-foreground">
                Ville
              </label>
              <select
                id="city"
                className="h-9 w-full sm:w-64 rounded-md border bg-background px-3 text-sm"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Toutes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              {selectedCity ? (
                <button
                  type="button"
                  className="h-9 rounded-md border px-3 text-sm hover:bg-muted transition-colors"
                  onClick={() => setSelectedCity('')}
                >
                  Réinitialiser
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filtered.map((photo, index) => (
          <ImageContainer key={photo.id ?? index} photo={photo} index={index} />
        ))}
      </div>
    </div>
  );
}
