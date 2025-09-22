'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

import { Button } from './button';
import { cn } from '@/lib/utils';
// import { routing } from '@/i18n/routing';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageSwitcherProps {
  className?: string;
  showFlags?: boolean;
  variant?: 'button' | 'dropdown';
}

export function LanguageSwitcher({
  className,
  showFlags = true,
  variant = 'button',
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations('footer');
  const router = useRouter();
  // const pathname = usePathname();

  const currentLanguage = languages.find(lang => lang.code === locale);
  const otherLanguage = languages.find(lang => lang.code !== locale);

  const handleLanguageChange = (newLocale: string) => {
    router.push('/', { locale: newLocale });
  };

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <select
          value={locale}
          onChange={e => handleLanguageChange(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t('language')}
        >
          {languages.map(language => (
            <option key={language.code} value={language.code}>
              {showFlags && `${language.flag} `}{language.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => otherLanguage && handleLanguageChange(otherLanguage.code)}
        className="h-8 px-2"
        title={`${t('language')}: ${otherLanguage?.name}`}
      >
        {showFlags ? (
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {otherLanguage?.flag}
            <span className="hidden sm:inline">{otherLanguage?.name}</span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span className="text-xs font-mono uppercase">
              {otherLanguage?.code}
            </span>
          </span>
        )}
      </Button>
      <span className="text-xs text-muted-foreground hidden md:inline">
        {currentLanguage?.name}
      </span>
    </div>
  );
}