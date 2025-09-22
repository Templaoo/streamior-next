'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/advanced-skeleton';
import { 
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Users, 
  Settings, 
  LogOut,
  FolderOpen,
  Share2
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 border-r">
          <div className="flex h-14 items-center border-b px-6">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const navigation = [
    {
      title: 'Home',
      href: '/dashboard',
      icon: Home,
      active: true,
    },
    {
      title: 'Library',
      href: '/dashboard/library',
      icon: FolderOpen,
      active: false,
    },
    {
      title: 'Destinations',
      href: '/dashboard/destinations',
      icon: Share2,
      active: false,
    },
    {
      title: 'Members',
      href: '/dashboard/members',
      icon: Users,
      active: false,
    },
  ];

  const accountNavigation = [
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      active: false,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Streamior</h2>
              <SidebarTrigger 
                open={sidebarOpen}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNavGroup title="">
              <SidebarNav>
                {navigation.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    icon={item.icon}
                    active={item.active}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                  >
                    {item.title}
                  </SidebarNavItem>
                ))}
              </SidebarNav>
            </SidebarNavGroup>

            <SidebarNavGroup title="">
              <SidebarNav>
                {accountNavigation.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    icon={item.icon}
                    active={item.active}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                  >
                    {item.title}
                  </SidebarNavItem>
                ))}
              </SidebarNav>
            </SidebarNavGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="space-y-4">
              {/* Storage Info */}
              <div className="px-3 py-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span>Storage</span>
                  <span>0 of 5 hours</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full w-0" />
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1">
                  Add more
                </Button>
              </div>
              
              {/* User Profile */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{user.displayName || 'User'}</div>
                    <div className="text-muted-foreground truncate">{user.email}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex h-14 items-center border-b px-4 md:hidden">
          <SidebarTrigger 
            open={sidebarOpen}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h2 className="ml-4 text-lg font-semibold">Streamior</h2>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
