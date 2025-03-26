import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Navigation from '../Navigation';
import { UserProvider } from '../../context/UserContext';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the context to provide a test user
jest.mock('../../context/UserContext', () => ({
  useUser: jest.fn().mockReturnValue({
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      profileImage: 'https://i.pravatar.cc/150?u=test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    isLoading: false,
    isAuthenticated: true,
    logout: jest.fn(),
    login: jest.fn(),
    switchUser: jest.fn(),
  }),
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Create a mock implementation of useRouter
const mockUseRouter = {
  push: jest.fn(),
  pathname: '/',
};

describe('Navigation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockUseRouter);
  });

  it('renders horizontal navigation with menu items', () => {
    render(
      <UserProvider>
        <Navigation />
      </UserProvider>
    );

    // Check that the navigation menu is rendered with items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Chores')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Shopping List')).toBeInTheDocument();

    // Check that the navigation is horizontal (check for container class)
    const container = screen.getByText('Home Organization').closest('div');
    expect(container?.className).toContain('flex items-center');
  });

  it('displays user profile photo', () => {
    render(
      <UserProvider>
        <Navigation />
      </UserProvider>
    );

    // Check that the user profile container exists
    const profileContainer = screen.getByTestId('user-profile-container');
    expect(profileContainer).toBeInTheDocument();

    // Check that it contains the user name
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows dropdown menu when profile is clicked', () => {
    render(
      <UserProvider>
        <Navigation />
      </UserProvider>
    );

    // Profile dropdown should not be visible initially
    expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();

    // Click the profile button
    const profileButton = screen.getByText('Test User').closest('button');
    if (profileButton) fireEvent.click(profileButton);

    // Check that the dropdown is now visible
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();

    // Check that it contains the required options
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
    expect(screen.getByText('Switch user')).toBeInTheDocument();
  });

  it('handles navigation correctly from dropdown menu', () => {
    render(
      <UserProvider>
        <Navigation />
      </UserProvider>
    );

    // Open the dropdown
    const profileButton = screen.getByText('Test User').closest('button');
    if (profileButton) fireEvent.click(profileButton);

    // Click the Settings option
    fireEvent.click(screen.getByText('Settings'));

    // Check that the router was called with the correct path
    expect(mockUseRouter.push).toHaveBeenCalledWith('/settings');
  });
});
