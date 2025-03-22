'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export default function Navigation() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Handle logout
  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  // Only render client-specific content after mounting
  if (!mounted) {
    return (
      <nav className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6'>
        <div className='flex justify-between items-center max-w-7xl mx-auto'>
          <div className='flex items-center space-x-4'>
            <Link
              href='/'
              className='text-xl font-bold text-blue-600 dark:text-blue-400'
            >
              HomeOrg
            </Link>
          </div>
          <div className='w-10 h-10'></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6'>
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        <div className='flex items-center space-x-4'>
          <Link
            href='/'
            className='text-xl font-bold text-blue-600 dark:text-blue-400'
          >
            HomeOrg
          </Link>

          <NavigationMenu className='hidden md:block'>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href='/dashboard' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/chores' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Chores
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/inventory' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Inventory
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className='flex items-center space-x-4'>
          <ThemeToggle />

          {!loading && !user && (
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => handleNavigation('/login')}
                className='px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavigation('/register')}
                className='px-4 py-2 text-sm font-medium bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50'
              >
                Sign Up
              </button>
            </div>
          )}

          {!loading && user && (
            <div className='flex items-center'>
              <button
                onClick={handleLogout}
                className='px-4 py-2 text-sm font-medium bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50'
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
