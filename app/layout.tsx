import './globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode, FC } from 'react';
import Menu from '@/components/ui/menu';
import { Particles } from '@/components/particles';
import { Providers } from '@/lib/providers';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Menu />
          <Particles className="absolute inset-0 -z-10" />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
