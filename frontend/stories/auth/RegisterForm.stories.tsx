import type { Meta, StoryObj } from '@storybook/react';
import { RegisterForm } from '@/components/auth/register-form';
import { useAuth } from '@/context/auth-context';

// Mock the auth context
jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    register: async () => {},
    error: null,
    loading: false,
  }),
}));

// Define the component's metadata for Storybook
const meta: Meta<typeof RegisterForm> = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
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
type Story = StoryObj<typeof RegisterForm>;

// Define different states for the register form
export const Default: Story = {};

export const WithError: Story = {
  decorators: [
    (Story) => {
      // Override the mock to include an error
      (useAuth as jest.Mock).mockReturnValue({
        register: async () => {},
        error: 'Email address is already in use',
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
        register: async () => {},
        error: null,
        loading: true,
      });
      return <Story />;
    },
  ],
};
