import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

const gapClasses = {
  none: '',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export const ResponsiveGrid = ({
  children,
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md'
}: ResponsiveGridProps) => {
  const gridClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={cn(
      'grid',
      gridClasses,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};