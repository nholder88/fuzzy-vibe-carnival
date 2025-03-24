import type { Meta, StoryObj } from '@storybook/react';
import ActivityFeed from '../components/activity-feed';

const meta: Meta<typeof ActivityFeed> = {
  title: 'Components/ActivityFeed',
  component: ActivityFeed,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Default: Story = {};

// Mock the fetch activities function to return empty data
export const Empty: Story = {
  parameters: {
    mockData: {
      activities: [],
    },
  },
};

// Mock the fetch activities function to return loading state
export const Loading: Story = {
  parameters: {
    mockData: {
      loading: true,
    },
  },
};
