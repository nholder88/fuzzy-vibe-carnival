'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Navigation() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [guestUser, setGuestUser] = useState(false);

  // Check if user is logged in, if not it's a guest user
  useEffect(() => {
    if (!loading && !user) {
      setGuestUser(true);
    } else {
      setGuestUser(false);
    }
  }, [user, loading]);

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Handle logout
  const handleLogout = async () => {
    if (logout) {
      logout();
      router.push('/login');
    }
  };

  return (
    <div className='border-b'>
      <div className='container flex h-16 items-center px-4'>
        {/* Logo Section */}
        <div className='flex mr-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
              <span className='text-primary-foreground font-bold'>VC</span>
            </div>
            <span className='hidden sm:inline-block font-bold'>
              Vibe Carnival
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <NavigationMenu className='hidden md:flex mx-6'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href='/' legacyBehavior passHref>
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
            <NavigationMenuItem>
              <Link href='/shopping-list' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Shopping List
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className='ml-auto flex items-center space-x-4'>
          {/* User Profile */}
          <div data-testid='user-profile-container'>
            {!loading && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex items-center space-x-2 focus:outline-none'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={
                          'https://i.pravatar.cc/150?u=' +
                          (user?.email || 'guest')
                        }
                        alt={user?.email || 'Guest User'}
                      />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-start'>
                      <span className='text-sm font-medium'>
                        {user
                          ? `${user.firstName || ''} ${
                              user.lastName || ''
                            }`.trim()
                          : 'Guest User'}
                      </span>
                      <Badge variant='outline' className='text-xs'>
                        {user ? 'user' : 'guest'}
                      </Badge>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/profile')}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/settings')}
                  >
                    Settings
                  </DropdownMenuItem>
                  {!guestUser && (
                    <DropdownMenuItem
                      onClick={() => handleNavigation('/switch-user')}
                    >
                      Switch User
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {guestUser ? (
                    <DropdownMenuItem
                      onClick={() => handleNavigation('/login')}
                    >
                      Log In
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleLogout}>
                      Log Out
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
