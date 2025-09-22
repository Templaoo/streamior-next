'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu,
  X
} from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

// interface SidebarContentProps {
//   title: string;
//   navigation: Array<{
//     title: string;
//     href: string;
//     icon: React.ComponentType<{ className?: string }>;
//     active?: boolean;
//   }>;
//   user?: {
//     name: string;
//     email: string;
//     avatar?: string;
//   } | null;
//   onSignOut?: () => void;
// }

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-64 flex-col border-r bg-background',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex h-14 items-center border-b px-6', className)}
    {...props}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ScrollArea className="flex-1">
    <div
      ref={ref}
      className={cn('flex-1 p-4', className)}
      {...props}
    />
  </ScrollArea>
));
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t p-4', className)}
    {...props}
  />
));
SidebarFooter.displayName = 'SidebarFooter';

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn('space-y-1', className)}
    {...props}
  />
));
SidebarNav.displayName = 'SidebarNav';

const SidebarNavItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
  }
>(({ className, active, icon: Icon, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant={active ? 'secondary' : 'ghost'}
    className={cn(
      'w-full justify-start gap-2 h-9',
      active && 'bg-secondary',
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </Button>
));
SidebarNavItem.displayName = 'SidebarNavItem';

const SidebarNavGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
  }
>(({ className, title, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  >
    {title && (
      <div className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </div>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
));
SidebarNavGroup.displayName = 'SidebarNavGroup';

// Mobile sidebar toggle button
const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    open?: boolean;
  }
>(({ className, open, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    className={cn('md:hidden', className)}
    {...props}
  >
    {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
  </Button>
));
SidebarTrigger.displayName = 'SidebarTrigger';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarTrigger,
};
