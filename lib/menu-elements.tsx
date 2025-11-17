'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

type Props = {
  className?: string;
  mobileMenuOpen?: Boolean;
  setMobileMenuOpen?: any;
};

export default function MenuElements({
  className,
  mobileMenuOpen,
  setMobileMenuOpen,
}: Props) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Photographie', href: '/photography' },
    // { name: "Photo-Series", href: "/photo-series" },
    { name: 'About', href: '/about' },
  ];
  return (
    <ul className={`${className} flex justify-center`}>
      {navigation.map((item) => (
        <li key={item.name}>
          <Link
            onClick={() => (mobileMenuOpen ? setMobileMenuOpen(false) : '')}
            href={item.href}
            className={`${className} ${
              pathname === item.href ? 'font-bold ' : 'no'
            }  leading-8 px-2 md:px-4 py-2 items-center break-normal inline-block  break-keep`}
          >
            {pathname === item.href && (
              <motion.span
                layoutId=""
                className="absolute left-0 bottom-0 top-full block z-90 h-[1px] w-full bg-black dark:bg-white "
              ></motion.span>
            )}
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
