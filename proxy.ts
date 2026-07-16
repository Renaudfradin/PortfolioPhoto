import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

// Skip Next internals, static files, and API routes (e.g. /api/revalidate)
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
