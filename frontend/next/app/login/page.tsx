import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login | Home Organization App',
  description: 'Login to your account in the Home Organization App',
};

export default function LoginPage() {
  return (
    <div className='container flex h-screen items-center justify-center'>
      <div className='w-full max-w-md'>
        <LoginForm />
      </div>
    </div>
  );
}
