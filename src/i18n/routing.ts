import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always show locale prefix
  localePrefix: 'as-needed',

  // The pathname template for routes
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      fr: '/a-propos'
    },
    '/contact': {
      en: '/contact',
      fr: '/contact'
    },
    '/blog': '/blog',
    '/blog/[slug]': {
      en: '/blog/[slug]',
      fr: '/blog/[slug]'
    },
    '/services': {
      en: '/services',
      fr: '/services'
    },
    '/login': {
      en: '/login',
      fr: '/connexion'
    },
    '/dashboard': '/dashboard'
  }
});

// This should only be done after upgrading to next-intl v3.19.1 or newer
// For now, we'll use the regular Next.js imports
