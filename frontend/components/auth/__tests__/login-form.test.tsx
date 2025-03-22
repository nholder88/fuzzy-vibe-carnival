import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../login-form';
import { useAuth } from '@/context/auth-context';
import '@testing-library/jest-dom';

// Mock the auth context
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up the mock implementation
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: false,
      authLoading: false,
    });
  });

  it('renders the login form correctly', () => {
    render(<LoginForm />);

    // Check for form elements
    expect(
      screen.getByText('Login', { selector: '.text-2xl' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login$/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('displays validation errors for invalid inputs', async () => {
    render(<LoginForm />);

    // Submit form without filling fields
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('calls login function with correct values on submit', async () => {
    render(<LoginForm />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if login function was called with correct values
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message when login fails', () => {
    // Set up auth context with error
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: 'Invalid credentials',
      loading: false,
      authLoading: false,
    });

    render(<LoginForm />);

    // Check if error message is displayed
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('disables button and shows loading state during login', () => {
    // Set up auth context with loading state
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: false,
      authLoading: true,
    });

    render(<LoginForm />);

    // Check if button is disabled and shows loading text
    const button = screen.getByRole('button', { name: /logging in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Logging in...');
  });

  it('should not show loading state on initial render', () => {
    // This test should now pass as we've fixed the bug
    // Mock the auth context with initial loading true but authLoading false
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: true,
      authLoading: false,
    });

    render(<LoginForm />);

    // Check if button is enabled and shows "Login"
    const button = screen.getByRole('button', { name: /login$/i });
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Login');
  });
});
