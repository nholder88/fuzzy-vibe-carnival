import type { Meta, StoryObj } from '@storybook/react';
import { InviteDialog } from '@/components/household/InviteDialog';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// Define the component's metadata for Storybook
const meta: Meta<typeof InviteDialog> = {
  title: 'Household/InviteDialog',
  component: InviteDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onOpenChange: { action: 'openChanged' },
  },
  args: {
    householdId: '123-household-id',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InviteDialog>;

// Default dialog (open)
export const Default: Story = {
  args: {
    open: true,
  },
};

// Error feedback on invalid email
export const InvalidEmail: Story = {
  args: {
    open: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Enter an invalid email
    const emailInput = canvas.getByLabelText('Email Address');
    await userEvent.type(emailInput, 'not-an-email');

    // Submit the form
    const submitButton = canvas.getByRole('button', {
      name: 'Send Invitation',
    });
    await userEvent.click(submitButton);

    // Verify error message appears
    const errorMessage = await canvas.findByText(
      'Please enter a valid email address'
    );
    expect(errorMessage).toBeInTheDocument();
  },
};

// Valid submission
export const ValidSubmission: Story = {
  args: {
    open: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the email
    const emailInput = canvas.getByLabelText('Email Address');
    await userEvent.type(emailInput, 'user@example.com');

    // Select a role
    const roleSelect = canvas.getByLabelText('Role (Optional)');
    await userEvent.click(roleSelect);

    // There should be admin option in the dropdown
    const adminOption = await canvas.findByText('Admin');
    await userEvent.click(adminOption);

    // Verify the input has correct value
    expect(emailInput).toHaveValue('user@example.com');
  },
};

// Loading state
export const Loading: Story = {
  args: {
    open: true,
  },
  parameters: {
    mockData: [
      {
        url: 'http://localhost:3001/api/households/*/invites',
        method: 'POST',
        status: 200,
        response: {},
        delay: 2000, // Simulate a 2-second delay
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in valid data
    const emailInput = canvas.getByLabelText('Email Address');
    await userEvent.type(emailInput, 'user@example.com');

    // Submit form to trigger loading state
    const submitButton = canvas.getByRole('button', {
      name: 'Send Invitation',
    });
    await userEvent.click(submitButton);

    // Verify button changes to loading state
    const loadingButton = await canvas.findByText('Sending...');
    expect(loadingButton).toBeInTheDocument();
  },
};
