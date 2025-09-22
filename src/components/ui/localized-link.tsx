import { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export interface LocalizedLinkProps extends ComponentProps<typeof Link> {
  className?: string;
}

export function LocalizedLink({ 
  className, 
  children, 
  ...props 
}: LocalizedLinkProps) {
  return (
    <Link
      className={cn(
        'text-primary underline-offset-4 hover:underline transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}