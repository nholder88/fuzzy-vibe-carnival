import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Navigation from '../components/Navigation';

// The component will use the global mocks provided in preview.tsx
const meta: Meta<typeof Navigation> = {
  title: 'Layout/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Navigation component with horizontal menu using shadcn/ui components.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default navigation state with logged-in user.',
      },
    },
  },
};
