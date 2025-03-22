import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Register | Home Organization App',
  description: 'Create a new account in the Home Organization App',
};

export default function RegisterPage() {
  return (
    <div className='container flex h-screen items-center justify-center'>
      <div className='w-full max-w-md'>
        <RegisterForm />
      </div>
    </div>
  );
}
