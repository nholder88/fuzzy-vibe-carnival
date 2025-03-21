import type { Meta, StoryObj } from '@storybook/react';
import ChoreForm from '../components/chores/ChoreForm';

const meta: Meta<typeof ChoreForm> = {
  title: 'Chores/ChoreForm',
  component: ChoreForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChoreForm>;

const mockUsers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
];

const mockChore = {
  id: '1',
  title: 'Clean Kitchen',
  description: 'Wash dishes, wipe counters, sweep floor',
  priority: 'medium',
  status: 'pending',
  due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  recurring: 'daily',
  assigned_to: 'John Doe',
};

export const CreateNew: Story = {
  args: {
    householdId: '123',
    users: mockUsers,
    onSuccess: () => console.log('Success'),
    onCancel: () => console.log('Cancel'),
  },
};

export const EditExisting: Story = {
  args: {
    householdId: '123',
    chore: mockChore,
    users: mockUsers,
    onSuccess: () => console.log('Success'),
    onCancel: () => console.log('Cancel'),
  },
};

export const WithValidationError: Story = {
  args: {
    householdId: '123',
    users: mockUsers,
    onSuccess: () => console.log('Success'),
    onCancel: () => console.log('Cancel'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', { name: /save/i });
    await userEvent.click(submitButton);
  },
};

export const Submitting: Story = {
  args: {
    householdId: '123',
    users: mockUsers,
    onSuccess: () => console.log('Success'),
    onCancel: () => console.log('Cancel'),
  },
  parameters: {
    mockData: {
      isSubmitting: true,
    },
  },
};

export const WithError: Story = {
  args: {
    householdId: '123',
    users: mockUsers,
    onSuccess: () => console.log('Success'),
    onCancel: () => console.log('Cancel'),
  },
  parameters: {
    mockData: {
      error: 'Failed to save chore. Please try again.',
    },
  },
};
