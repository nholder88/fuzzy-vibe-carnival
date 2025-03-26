import { User } from '../types';

// This would be replaced with actual API calls in a production environment
// Demo data for development purposes
const demoUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    household_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profileImage: 'https://i.pravatar.cc/150?u=john@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    household_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profileImage: 'https://i.pravatar.cc/150?u=jane@example.com',
  },
];

// Get current user profile (in a real app, this would validate a token with the server)
export async function getCurrentUser(): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // In a real app, this would be an API call
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      return JSON.parse(userJson);
    }

    // If no saved user, return the first demo user
    const defaultUser = demoUsers[0];
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Update user settings
export async function updateUserSettings(
  userId: string,
  updatedData: Partial<User>
): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // In a real app, this would be an API call
    const user = demoUsers.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update the user
    const updatedUser = {
      ...user,
      ...updatedData,
      updated_at: new Date().toISOString(),
    };

    // If this is the current user, update local storage
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser.id === userId) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
}

// Log in user
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  try {
    // In a real app, this would validate credentials with the server
    const user = demoUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Save to local storage
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Log out user
export async function logoutUser(): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // In a real app, this would invalidate the token on the server
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// Get all household members (for switching users)
export async function getHouseholdMembers(
  householdId: string
): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    // In a real app, this would be an API call
    return demoUsers.filter((user) => user.household_id === householdId);
  } catch (error) {
    console.error('Error getting household members:', error);
    throw error;
  }
}
