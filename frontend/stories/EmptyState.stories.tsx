import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from '../components/ui/empty-state';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    message: 'No items found',
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Your custom message here',
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'This is a longer message that might wrap to multiple lines in the empty state component',
  },
};
