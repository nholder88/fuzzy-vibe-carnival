import type { Meta, StoryObj } from '@storybook/react';
import ChoreList from '../components/chores/ChoreList';

const meta: Meta<typeof ChoreList> = {
  title: 'Chores/ChoreList',
  component: ChoreList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChoreList>;

const mockChores = [
  {
    id: '1',
    title: 'Clean Kitchen',
    description: 'Wash dishes, wipe counters, sweep floor',
    priority: 'medium',
    status: 'pending',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    recurring: 'daily',
    assigned_to: 'John Doe',
  },
  {
    id: '2',
    title: 'Vacuum Living Room',
    description: 'Vacuum all carpets and rugs',
    priority: 'low',
    status: 'in_progress',
    due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    recurring: 'weekly',
    assigned_to: 'Jane Smith',
  },
  {
    id: '3',
    title: 'Take Out Trash',
    description: 'Empty all trash bins and take to curb',
    priority: 'high',
    status: 'completed',
    due_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    recurring: 'daily',
    assigned_to: 'Mike Johnson',
  },
];

// Mock the getChores API call
const mockGetChores = async (householdId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockChores;
};

// Mock the API module
jest.mock('../lib/api/chores', () => ({
  getChores: mockGetChores,
}));

export const Default: Story = {
  args: {
    householdId: '123',
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
      error: 'Failed to load chores. Please try again later.',
    },
  },
};
