import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input border-solid bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'border-input  hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        purple: 'bg-purple-600 text-white hover:bg-purple-800',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        gradient: 'btn-gradient text-white px-10 py-2 rounded-md hover:opacity-90 text-lg',
        gradientOutline:
          'btn-gradient-outline text-white px-10 py-2 rounded-md hover:opacity-90 text-lg',
        disabled: 'bg-[#A1A1A1] text-white',
        primary: 'bg-primary text-white hover:bg-primary-400',
        unrealPrimary: 'bg-unrealPrimary text-white hover:bg-unrealPrimary-400',
        unrealSecondary: 'bg-secondary-gradient text-white hover:opacity-80',
        unrealPrimaryBtn: 'background-purple-gradient text-white',
        dashed:
          'bg-transparent border-dashed border-2 border-gray-300 text-primary-muted hover:bg-primary/90 hover:bg-gray-50',
      },

      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: any;
  diasbleClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      diasbleClassName,
      variant,
      size,
      children,
      isLoading,
      asChild = false,
      disabled,
      icon,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={clsx(
          'flex gap-2',
          buttonVariants({ variant, size, className }),
          {
            'bg-[#ACACAC] text-white': disabled && !diasbleClassName,
          },
          diasbleClassName,
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : icon}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
