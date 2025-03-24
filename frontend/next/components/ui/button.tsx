import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Using Skeleton UI's button styling approach
const buttonVariants = cva('btn', {
  variants: {
    variant: {
      default: 'preset-filled-primary-500',
      destructive: 'preset-filled-error-500',
      outline: 'preset-outlined-primary-500',
      secondary: 'preset-filled-secondary-500',
      ghost: 'hover:preset-tonal',
      link: 'btn-link',
    },
    size: {
      default: 'btn-base',
      sm: 'btn-sm',
      lg: 'btn-lg',
      icon: 'btn-icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * A button component using Skeleton UI styling
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
