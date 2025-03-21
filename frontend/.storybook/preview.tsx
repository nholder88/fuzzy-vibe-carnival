import type { Preview } from '@storybook/react';
import React, { ReactNode } from 'react';
import '../app/styles/globals.css';

// Mock router implementation
const mockRouter = {
  push: async () => true,
  replace: async () => true,
  prefetch: async () => undefined,
  back: () => {},
  forward: () => {},
  refresh: () => {},
  pathname: '/',
};

// Mock Next.js navigation hooks
const MockNextNavigation = ({ children }: { children: ReactNode }) => {
  // Manually override the modules at runtime for Storybook
  // @ts-ignore - we're deliberately overriding the module for Storybook
  window.useRouter = () => mockRouter;
  // @ts-ignore
  window.usePathname = () => '/';
  // @ts-ignore
  window.useSearchParams = () => new URLSearchParams();

  return <>{children}</>;
};

// Create mock context providers
const MockUserProvider = ({ children }: { children: ReactNode }) => {
  // Create mock user data
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    profileImage: 'https://i.pravatar.cc/150?u=test@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Manually override the useUser hook at runtime for Storybook
  // @ts-ignore - we're deliberately overriding the module for Storybook
  window.useUser = () => ({
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    logout: () => Promise.resolve(),
    login: () => Promise.resolve(),
    switchUser: () => Promise.resolve(),
  });

  return <>{children}</>;
};

// Create a decorator to wrap stories
const withMockProviders = (Story: React.ComponentType) => {
  return (
    <MockUserProvider>
      <MockNextNavigation>
        <div className='decorator-wrapper'>
          <Story />
        </div>
      </MockNextNavigation>
    </MockUserProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [withMockProviders],
};

export default preview;
