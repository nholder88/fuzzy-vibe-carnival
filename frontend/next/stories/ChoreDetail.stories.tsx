import type { Meta, StoryObj } from '@storybook/react';
import ChoreDetail from '../components/chores/ChoreDetail';

const meta: Meta<typeof ChoreDetail> = {
  title: 'Chores/ChoreDetail',
  component: ChoreDetail,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChoreDetail>;

const mockUsers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
];

const baseChore = {
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
};

export const Default: Story = {
  args: {
    chore: baseChore,
    users: mockUsers,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
    onDelete: () => console.log('Delete'),
  },
};

export const Completed: Story = {
  args: {
    chore: {
      ...baseChore,
      status: 'completed',
      completed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    users: mockUsers,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
    onDelete: () => console.log('Delete'),
  },
};

export const HighPriority: Story = {
  args: {
    chore: {
      ...baseChore,
      priority: 'high',
    },
    users: mockUsers,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
    onDelete: () => console.log('Delete'),
  },
};

export const Overdue: Story = {
  args: {
    chore: {
      ...baseChore,
      due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    users: mockUsers,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
    onDelete: () => console.log('Delete'),
  },
};

export const NoDescription: Story = {
  args: {
    chore: {
      ...baseChore,
      description: undefined,
    },
    users: mockUsers,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
    onDelete: () => console.log('Delete'),
  },
};

export const NoDueDate: Story = {
  args: {
    chore: {
      ...baseChore,
      due_date: undefined,
    },
    users: mockUsers,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
    onDelete: () => console.log('Delete'),
  },
};

export const Unassigned: Story = {
  args: {
    chore: {
      ...baseChore,
      assigned_to: undefined,
    },
    users: mockUsers,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
    onDelete: () => console.log('Delete'),
  },
}; 