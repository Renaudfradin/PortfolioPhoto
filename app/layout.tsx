import './globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode, FC } from 'react';
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
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
