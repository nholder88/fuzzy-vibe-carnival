'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
};

type RegisterData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for token in localStorage on mount with SSR safety
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Set default Authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token, user } = response.data;

      // Store token in both cookies and localStorage for consistency across auth mechanisms
      if (typeof window !== 'undefined') {
        // Set in localStorage for client-side use
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Set in cookies for middleware
        document.cookie = `token=${access_token}; path=/; max-age=604800; SameSite=Lax`;
      }

      // Set Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Update state
      setUser(user);

      // Redirect to dashboard with App Router navigation
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Invalid credentials');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      await axios.post('/api/auth/register', userData);

      // Auto-login after successful registration
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token and user data from localStorage and cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Clear the cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];

    // Update state
    setUser(null);

    // Redirect to login page with App Router navigation
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
