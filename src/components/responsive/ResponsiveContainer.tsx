import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-2 py-1 sm:px-4 sm:py-2',
  md: 'px-4 py-2 sm:px-6 sm:py-4',
  lg: 'px-6 py-4 sm:px-8 sm:py-6',
};

export const ResponsiveContainer = ({ 
  children, 
  className,
  maxWidth = 'full',
  padding = 'md'
}: ResponsiveContainerProps) => {
  return (
    <div className={cn(
      'w-full mx-auto',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};