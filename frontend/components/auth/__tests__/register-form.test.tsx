import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../register-form';
import { useAuth } from '@/context/auth-context';
import '@testing-library/jest-dom';

// Mock the auth context
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

describe('RegisterForm', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up the mock implementation
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: null,
      loading: false,
    });
  });

  it('renders the register form correctly', () => {
    render(<RegisterForm />);

    // Check for form elements
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('displays validation errors for invalid inputs', async () => {
    render(<RegisterForm />);

    // Submit form without filling fields
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('validates password complexity', async () => {
    render(<RegisterForm />);

    // Fill form fields with invalid password
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for password complexity errors
    await waitFor(() => {
      expect(
        screen.getByText(/password must contain at least one uppercase letter/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must contain at least one number/i)
      ).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    render(<RegisterForm />);

    // Fill form fields with different passwords
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Password123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password456' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for password match error
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('calls register function with correct values on submit', async () => {
    render(<RegisterForm />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Password123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check if register function was called with correct values
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
      });
    });
  });

  it('displays error message when registration fails', () => {
    // Set up auth context with error
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: 'Email already in use',
      loading: false,
    });

    render(<RegisterForm />);

    // Check if error message is displayed
    expect(screen.getByText('Email already in use')).toBeInTheDocument();
  });

  it('disables button and shows loading state during registration', () => {
    // Set up auth context with loading state
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: null,
      loading: true,
    });

    render(<RegisterForm />);

    // Check if button is disabled and shows loading text
    const button = screen.getByRole('button', { name: /creating account/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Creating account...');
  });
});
