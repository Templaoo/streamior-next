import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Header } from '@/components/layout/header';
import { LocalizedLink } from '@/components/ui/localized-link';
import { Zap, Globe, Rocket } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('homepage');
  // const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');

  const features = [
    {
      icon: Zap,
      title: t('features.performance.title'),
      description: t('features.performance.description'),
    },
    {
      icon: Globe,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
    },
    {
      icon: Rocket,
      title: t('features.modern.title'),
      description: t('features.modern.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t('subtitle')}
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            {t('description')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <LocalizedLink href="/login">
              <Button size="lg">
                Sign In
              </Button>
            </LocalizedLink>
            <LocalizedLink href="/dashboard">
              <Button variant="outline" size="lg">
                Dashboard
              </Button>
            </LocalizedLink>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('features.title')}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 rounded-lg bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {t('cta.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('cta.description')}
          </p>
          <div className="mt-6">
            <LocalizedLink href="/login">
              <Button variant="outline">
                Get Started
              </Button>
            </LocalizedLink>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 mt-24">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                {tFooter('copyright')}
              </p>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher variant="dropdown" />
                <ModeToggle />
              </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
