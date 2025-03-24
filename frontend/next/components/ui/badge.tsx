import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'preset-filled-primary-500',
      secondary: 'preset-filled-secondary-500',
      destructive: 'preset-filled-error-500',
      outline: 'preset-outlined-primary-500',
    };

    return (
      <div
        ref={ref}
        className={cn('badge', variantClasses[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
