import type { Meta, StoryObj } from '@storybook/react';
import ChoreManager from '../components/chores/ChoreManager';

// Mock data
const mockChores = [
  {
    id: '1',
    title: 'Clean Kitchen',
    description: 'Wash dishes, wipe counters, sweep floor',
    priority: 'medium',
    status: 'pending',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    recurring: 'daily',
    assigned_to: '1',
    created_by: '2',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: null,
  },
  {
    id: '2',
    title: 'Vacuum Living Room',
    description: 'Vacuum all carpets and rugs',
    priority: 'low',
    status: 'in_progress',
    due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    recurring: 'weekly',
    assigned_to: '2',
    created_by: '1',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: null,
  },
  {
    id: '3',
    title: 'Take Out Trash',
    description: 'Empty all trash bins and take to curb',
    priority: 'high',
    status: 'completed',
    due_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    recurring: 'daily',
    assigned_to: '1',
    created_by: '2',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'member',
    household_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock the API calls
const mockGetChores = async (householdId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockChores;
};

const mockGetUsers = async (householdId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockUsers;
};

const mockDeleteChore = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
};

// Add mock for window.confirm - only in browser environment
if (typeof window !== 'undefined') {
  // Store the original confirm function
  const originalConfirm = window.confirm;
  // Override confirm with a function that returns true for Storybook
  Object.defineProperty(window, 'confirm', {
    value: () => true,
    writable: true,
  });
}

// Define how to mock API modules
const prepareMocks = () => {
  // Mock API modules in a way compatible with both Jest and Storybook
  if (typeof jest !== 'undefined') {
    jest.mock('../lib/api/chores', () => ({
      getChores: mockGetChores,
      deleteChore: mockDeleteChore,
    }));
  } else {
    // For Storybook, we'll use the parameters
  }
};

// Call prepareMocks
prepareMocks();

// Set up render params for Storybook
const meta: Meta<typeof ChoreManager> = {
  title: 'Chores/ChoreManager',
  component: ChoreManager,
  parameters: {
    layout: 'fullscreen',
    // Mock the API calls directly in the stories parameters
    mockData: {
      chores: mockChores,
      users: mockUsers,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChoreManager>;

export const Default: Story = {
  args: {
    householdId: '123',
  },
};

export const Loading: Story = {
  args: {
    householdId: '123',
  },
  parameters: {
    mockData: {
      loading: true,
    },
  },
};

export const Error: Story = {
  args: {
    householdId: '123',
  },
  parameters: {
    mockData: {
      error: 'Failed to load data. Please try again later.',
    },
  },
};

export const Empty: Story = {
  args: {
    householdId: '123',
  },
  parameters: {
    mockData: {
      chores: [],
    },
  },
};
