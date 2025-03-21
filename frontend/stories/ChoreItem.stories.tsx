import type { Meta, StoryObj } from '@storybook/react';
import ChoreItem from '../components/chores/ChoreItem';

const meta: Meta<typeof ChoreItem> = {
  title: 'Chores/ChoreItem',
  component: ChoreItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChoreItem>;

const baseChore = {
  id: '1',
  title: 'Clean Kitchen',
  description: 'Wash dishes, wipe counters, sweep floor',
  priority: 'medium',
  status: 'pending',
  due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  recurring: 'daily',
  assigned_to: 'John Doe',
};

export const Default: Story = {
  args: {
    chore: baseChore,
  },
};

export const HighPriority: Story = {
  args: {
    chore: {
      ...baseChore,
      priority: 'high',
    },
  },
};

export const LowPriority: Story = {
  args: {
    chore: {
      ...baseChore,
      priority: 'low',
    },
  },
};

export const Completed: Story = {
  args: {
    chore: {
      ...baseChore,
      status: 'completed',
    },
  },
};

export const InProgress: Story = {
  args: {
    chore: {
      ...baseChore,
      status: 'in_progress',
    },
  },
};

export const Overdue: Story = {
  args: {
    chore: {
      ...baseChore,
      due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const NoDescription: Story = {
  args: {
    chore: {
      ...baseChore,
      description: undefined,
    },
  },
};

export const NoDueDate: Story = {
  args: {
    chore: {
      ...baseChore,
      due_date: undefined,
    },
  },
};

export const NoAssignment: Story = {
  args: {
    chore: {
      ...baseChore,
      assigned_to: undefined,
    },
  },
};
