import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InviteDialog } from '../household/InviteDialog';
import { useHousehold } from '@/hooks/useHousehold';

// Mock the useHousehold hook
jest.mock('@/hooks/useHousehold', () => ({
  useHousehold: jest.fn(),
}));

describe('InviteDialog', () => {
  const mockInviteMember = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementation
    (useHousehold as jest.Mock).mockReturnValue({
      isLoading: false,
      inviteMember: mockInviteMember,
    });
  });

  it('renders the invite dialog correctly', () => {
    render(
      <InviteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        householdId='test-household-id'
      />
    );

    // Check for dialog title and fields
    expect(screen.getByText('Invite Member')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Role (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Send Invitation')).toBeInTheDocument();
  });

  it('prevents submission with invalid email', async () => {
    render(
      <InviteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        householdId='test-household-id'
      />
    );

    // Type invalid email
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.input(emailInput, { target: { value: 'invalid-email' } });

    // Submit form
    const submitButton = screen.getByText('Send Invitation');
    fireEvent.click(submitButton);

    // Wait a moment for potential form submission
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Ensure inviteMember was not called, indicating validation prevented submission
    expect(mockInviteMember).not.toHaveBeenCalled();

    // Ensure dialog was not closed
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(
      <InviteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        householdId='test-household-id'
      />
    );

    // Enter valid email
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

    // Submit form
    const submitButton = screen.getByText('Send Invitation');
    fireEvent.click(submitButton);

    // Verify inviteMember was called with correct args
    await waitFor(() => {
      expect(mockInviteMember).toHaveBeenCalledWith(
        'test-household-id',
        'valid@example.com',
        'member'
      );
    });

    // Verify dialog was closed
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('displays loading state when submitting', async () => {
    // Mock the loading state
    (useHousehold as jest.Mock).mockReturnValue({
      isLoading: true,
      inviteMember: mockInviteMember,
    });

    render(
      <InviteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        householdId='test-household-id'
      />
    );

    // Check for loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeDisabled();
  });
});
