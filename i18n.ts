export const locales = ['en', 'fr', 'es', 'de', 'ru'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localePrefix = 'always';
