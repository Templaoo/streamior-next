'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/advanced-skeleton';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const stats = [
    {
      title: t('stats.totalUsers'),
      value: '2,350',
      description: '+20.1% from last month',
      icon: Users,
      trend: 'up',
    },
    {
      title: t('stats.activeUsers'),
      value: '1,234',
      description: '+15% from last month',
      icon: Activity,
      trend: 'up',
    },
    {
      title: t('stats.revenue'),
      value: '$45,231',
      description: '+10.5% from last month',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: t('stats.growth'),
      value: '+12.5%',
      description: '+2.1% from last month',
      icon: TrendingUp,
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('welcome')}, {user?.displayName || 'User'}!</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your application today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('overview')}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              Chart placeholder - Add your favorite chart library here
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest user interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      User action {i + 1}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() - i * 1000 * 60 * 15).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
