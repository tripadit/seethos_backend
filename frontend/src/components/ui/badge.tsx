import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        count: 'border-transparent bg-purple-50 text-purple-700',
        success: 'border-transparent bg-success-50 text-success-700',
        successDark: 'border-transparent bg-success-500 text-white',
        warning: 'border-transparent bg-warning text-white hover:bg-warning/80',
        destructiveDark: 'border-transparent bg-destructive text-white hover:bg-destructive/80',
        red: 'bg-[#F9E9EA] text-[#8D171C]',
        'light-blue': 'bg-[#EFF8FF] text-[#175CD3]',
        'dark-blue': 'bg-[#EEF4FF] text-[#3538CD]',
        'warning-light': 'bg-[#FFFAEB] text-[#B54708] border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
