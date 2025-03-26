'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/types';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  switchUser: async () => {},
});

export const useUser = () => useContext(UserContext);

// Sample user data for development
const demoUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    household_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profileImage: 'https://i.pravatar.cc/150?u=john@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    household_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profileImage: 'https://i.pravatar.cc/150?u=jane@example.com',
  },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate fetching user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, this would fetch from your API
        // For development, use demo data
        const currentUser = getCurrentUser();

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Get current user from local storage or use first demo user
  const getCurrentUser = (): User | null => {
    // In a real app, this might come from a JWT token or session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      return JSON.parse(savedUser);
    }

    // If no saved user, use the first demo user
    localStorage.setItem('currentUser', JSON.stringify(demoUsers[0]));
    return demoUsers[0];
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundUser = demoUsers.find((u) => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call to invalidate session
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const foundUser = demoUsers.find((u) => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Switch user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
