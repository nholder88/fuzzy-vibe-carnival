'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ children, open, onOpenChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open || false);

    React.useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open);
        onOpenChange?.(open);
      }
    }, [open, onOpenChange]);

    return (
      <div ref={ref} className='popover relative' {...props}>
        {children}
      </div>
    );
  }
);
Popover.displayName = 'Popover';

interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn('popover-trigger', className)} {...props} />
  )
);
PopoverTrigger.displayName = 'PopoverTrigger';

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'center' | 'start' | 'end';
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('popover-content card z-50 w-72 p-4 shadow-lg', className)}
      {...props}
    />
  )
);
PopoverContent.displayName = 'PopoverContent';

const PopoverAnchor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('popover-anchor', className)} {...props} />
));
PopoverAnchor.displayName = 'PopoverAnchor';

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
