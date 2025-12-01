import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Menu from '@/components/ui/menu';
import { Particles } from '@/components/particles';

export const dynamic = 'force-dynamic';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale }).catch(() => null);

  if (!messages) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Menu />
      <Particles className="absolute inset-0 -z-10" />
      {children}
    </NextIntlClientProvider>
  );
}
