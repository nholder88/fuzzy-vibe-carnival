'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className='container py-10'>
        <Card className='max-w-3xl mx-auto'>
          <CardHeader>
            <CardTitle className='text-2xl'>
              Welcome to your Dashboard
            </CardTitle>
            <CardDescription>
              You are logged in as {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p>
                Hello {user?.firstName} {user?.lastName}, you have successfully
                logged in to the Home Organization App!
              </p>
              <p>
                From here, you can manage your household tasks, inventory,
                shopping lists, and more.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={logout} variant='outline'>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
