'use client';

import { useTranslations } from 'next-intl';
import { LocalizedLink } from './localized-link';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const t = useTranslations('navigation');
  // const locale = useLocale();

  const navigationItems = [
    { href: '/' as const, label: t('home') },
    { href: '/about' as const, label: t('about') },
    { href: '/services' as const, label: t('services') },
    { href: '/blog' as const, label: t('blog') },
    { href: '/contact' as const, label: t('contact') },
  ];

  return (
    <nav className={cn('flex items-center space-x-6', className)}>
      {navigationItems.map((item) => (
        <LocalizedLink
          key={item.href}
          href={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.label}
        </LocalizedLink>
      ))}
    </nav>
  );
}