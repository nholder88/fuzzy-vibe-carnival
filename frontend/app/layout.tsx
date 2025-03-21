import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import Navigation from '../components/Navigation';
import { UserProvider } from '../context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Home Organization System',
  description: 'Streamline your household management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <UserProvider>
          <Navigation />
          <div className='pl-64 pt-4 pr-4 pb-4 min-h-screen'>{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
