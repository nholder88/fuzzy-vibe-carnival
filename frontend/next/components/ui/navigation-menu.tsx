import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'nav-menu relative z-10 flex max-w-max flex-1 items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
NavigationMenu.displayName = 'NavigationMenu';

interface NavigationMenuListProps
  extends React.HTMLAttributes<HTMLUListElement> {}

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  NavigationMenuListProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'nav-menu-list group flex flex-1 list-none items-center justify-center space-x-1',
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuItemProps
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('nav-menu-item', className)} {...props} />
));
NavigationMenuItem.displayName = 'NavigationMenuItem';

interface NavigationMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'nav-menu-trigger group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-hover focus:outline-none',
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className='relative top-[1px] ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180'
      aria-hidden='true'
    />
  </button>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

interface NavigationMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'nav-menu-content card absolute left-0 top-0 w-full rounded-md border',
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

interface NavigationMenuLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, ...props }, ref) => (
  <a ref={ref} className={cn('nav-menu-link', className)} {...props} />
));
NavigationMenuLink.displayName = 'NavigationMenuLink';

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
};
