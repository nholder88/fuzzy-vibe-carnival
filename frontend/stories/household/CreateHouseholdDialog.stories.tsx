import type { Meta, StoryObj } from '@storybook/react';
import { CreateHouseholdDialog } from '@/components/household/CreateHouseholdDialog';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// Define the component's metadata for Storybook
const meta: Meta<typeof CreateHouseholdDialog> = {
  title: 'Household/CreateHouseholdDialog',
  component: CreateHouseholdDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    onOpenChange: { action: 'openChanged' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreateHouseholdDialog>;

// Default dialog (open)
export const Default: Story = {
  args: {
    open: true,
    isLoading: false,
  },
};

// Error feedback on empty submission
export const ErrorFeedback: Story = {
  args: {
    open: true,
    isLoading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Submit the form without filling any fields
    const submitButton = canvas.getByRole('button', {
      name: 'Create Household',
    });
    await userEvent.click(submitButton);

    // Verify error message appears
    const errorMessage = await canvas.findByText('Household name is required');
    expect(errorMessage).toBeInTheDocument();
  },
};

// Valid state (with input)
export const ValidState: Story = {
  args: {
    open: true,
    isLoading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the household name
    const nameInput = canvas.getByLabelText('Household Name');
    await userEvent.type(nameInput, 'Smith Family');

    // Check if input has correct value
    expect(nameInput).toHaveValue('Smith Family');
  },
};

// Loading state
export const Loading: Story = {
  args: {
    open: true,
    isLoading: true,
  },
};
