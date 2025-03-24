import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateHouseholdForm } from '@/components/household/CreateHouseholdForm';

describe('CreateHouseholdForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the form correctly', () => {
    render(<CreateHouseholdForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Create Household')).toBeInTheDocument();
    expect(screen.getByLabelText('Household Name')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Household' })
    ).toBeInTheDocument();
  });

  it('shows error message when submitting an empty form', async () => {
    render(<CreateHouseholdForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Create Household' }));

    await waitFor(() => {
      expect(
        screen.getByText('Household name is required')
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(<CreateHouseholdForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText('Household Name'), {
      target: { value: 'Test Household' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Household' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Test Household' });
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<CreateHouseholdForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(
      screen.getByRole('button', { name: 'Creating...' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled();
  });
});
