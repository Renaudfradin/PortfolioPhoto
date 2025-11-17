import AnimationWrapper from '@/components/ui/animation-wrapper';
import { Header } from '@/components/ui/header-on-page';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Renaud Fradin - Développeur Full-Stack - Renaud Fradin Photo',
  keywords: [
    'Renaud Fradin',
    'Développeur Full-Stack',
    'Portfolio',
    'Renaud Fradin Photo',
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function About() {
  return (
    <AnimationWrapper>
      <Header
        title="Renaud Fradin"
        subtitle="Développeur Full-Stack passionné par la création d'expériences numériques innovantes"
        subtitle2="La photographie est un hobbie qui nourrit mon regard artistique et technique"
      ></Header>
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-6 mt-6">
          <Link
            href="https://www.linkedin.com/in/renaudfradin/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            LinkedIn
          </Link>
          <Link
            href="https://github.com/Renaudfradin"
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            GitHub
          </Link>
          <Link
            href="https://renaudfradin.vercel.app/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            Portfolio
          </Link>
        </div>
      </div>
    </AnimationWrapper>
  );
}
