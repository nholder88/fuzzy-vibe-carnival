'use client';

/// <reference path="../types/storybook.d.ts" />

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function Navigation() {
  // In Storybook, window.useRouter might be defined
  const router =
    typeof window !== 'undefined' && window.useRouter
      ? window.useRouter()
      : useRouter();

  // In Storybook, window.useUser might be defined
  const userHook =
    typeof window !== 'undefined' && window.useUser
      ? window.useUser()
      : useUser();
  const { user, logout, isLoading } = userHook;

  const [showDropdown, setShowDropdown] = useState(false);

  // Handle navigation
  const handleNavigation = (path: string) => {
    if (router && router.push) {
      router.push(path);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div className='w-full'>
      <div className='container mx-auto p-4 flex justify-between items-center'>
        {/* Logo and horizontal navigation */}
        <div className='flex items-center'>
          <Link href='/' className='text-xl font-bold mr-6'>
            Home Organization
          </Link>

          <NavigationMenu>
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
        </div>

        {/* User profile */}
        <div data-testid='user-profile-container'>
          {!isLoading && user && (
            <div className='relative'>
              <button
                onClick={toggleDropdown}
                className='flex items-center space-x-2 focus:outline-none'
              >
                <Avatar className='h-[25px] w-[25px]'>
                  <AvatarImage
                    src={
                      user.profileImage || 'https://i.pravatar.cc/150?u=default'
                    }
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span className='font-medium text-gray-700'>{user.name}</span>
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div
                  data-testid='profile-dropdown'
                  className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20'
                >
                  <button
                    onClick={() => {
                      handleNavigation('/settings');
                      closeDropdown();
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      handleNavigation('/switch-user');
                      closeDropdown();
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Switch user
                  </button>

                  <button
                    onClick={() => {
                      if (logout) {
                        logout();
                      }
                      closeDropdown();
                      handleNavigation('/login');
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content container */}
      <div className='container mx-auto p-4'>
        {/* Content will be rendered here */}
      </div>
    </div>
  );
}
