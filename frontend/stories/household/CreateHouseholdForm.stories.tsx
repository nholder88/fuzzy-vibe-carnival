import type { Meta, StoryObj } from '@storybook/react';
import { CreateHouseholdForm } from '@/components/household/CreateHouseholdForm';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// Define the component's metadata for Storybook
const meta: Meta<typeof CreateHouseholdForm> = {
  title: 'Household/CreateHouseholdForm',
  component: CreateHouseholdForm,
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
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreateHouseholdForm>;

// Empty form (default state)
export const EmptyForm: Story = {
  args: {
    isLoading: false,
  },
};

// Valid state (with input)
export const ValidState: Story = {
  args: {
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

// Error feedback on empty submission
export const ErrorFeedback: Story = {
  args: {
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

// Loading state
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
