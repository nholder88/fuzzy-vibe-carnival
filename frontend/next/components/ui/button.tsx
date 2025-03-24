import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * A button component using Skeleton UI styling
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'preset-filled-primary-500',
      destructive: 'preset-filled-error-500',
      outline: 'preset-outlined-primary-500',
      secondary: 'preset-filled-secondary-500',
      ghost: 'hover:preset-tonal',
      link: 'btn-link',
    };

    const sizeClasses = {
      default: 'btn-base',
      sm: 'btn-sm',
      lg: 'btn-lg',
      icon: 'btn-icon',
    };

    return (
      <button
        className={cn(
          'btn',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
