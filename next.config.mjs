import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 80, 95],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-folio.s3.fr-par.scw.cloud',
        pathname: '/**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');
export default withNextIntl(nextConfig);
