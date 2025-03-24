import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/context/auth-context';

// Mock the auth context
jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    login: async () => {},
    error: null,
    loading: false,
  }),
}));

// Define the component's metadata for Storybook
const meta: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='max-w-md w-full mx-auto'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

// Define different states for the login form
export const Default: Story = {};

export const WithError: Story = {
  decorators: [
    (Story) => {
      // Override the mock to include an error
      (useAuth as jest.Mock).mockReturnValue({
        login: async () => {},
        error: 'Invalid email or password',
        loading: false,
      });
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      // Override the mock to show loading state
      (useAuth as jest.Mock).mockReturnValue({
        login: async () => {},
        error: null,
        loading: true,
      });
      return <Story />;
    },
  ],
};
