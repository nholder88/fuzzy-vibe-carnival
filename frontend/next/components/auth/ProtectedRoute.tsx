'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if we have either a user in context or a token in localStorage
    // This prevents redirect loops with the middleware
    const hasToken =
      typeof window !== 'undefined' &&
      (!!localStorage.getItem('token') || document.cookie.includes('token='));

    if (!loading) {
      if (user || hasToken) {
        setIsAuthenticated(true);
      } else {
        // Only redirect if we're absolutely sure there's no authentication
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading || (!isAuthenticated && !user)) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Render children if authenticated or has token
  return <>{children}</>;
}
