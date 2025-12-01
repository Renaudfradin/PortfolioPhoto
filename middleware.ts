import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

// Appliquer le middleware à toutes les routes applicatives
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
