export const locales = ['en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

// Toujours préfixer l'URL avec la locale (/fr, /en)
export const localePrefix = 'always';
