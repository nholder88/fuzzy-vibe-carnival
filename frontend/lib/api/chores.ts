import axios from 'axios';
import { Chore } from '../types';

const API_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Mock chores data for development and testing
const mockChores: Chore[] = [
  {
    id: 'chore-001',
    title: 'Take out trash',
    description: 'Empty all trash cans and take to curb',
    assigned_to: 'user-123',
    household_id: 'household-001',
    priority: 'medium',
    recurring: 'weekly',
    status: 'pending',
    due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    created_by: 'user-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'chore-002',
    title: 'Wash dishes',
    description: 'Clean all dishes in the sink',
    assigned_to: 'user-456',
    household_id: 'household-001',
    priority: 'high',
    recurring: 'daily',
    status: 'completed',
    due_date: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    created_by: 'user-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'chore-003',
    title: 'Vacuum living room',
    description: 'Vacuum the carpet and clean the surfaces',
    assigned_to: 'user-789',
    household_id: 'household-001',
    priority: 'low',
    recurring: 'weekly',
    status: 'in_progress',
    due_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    created_by: 'user-002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getChores = async (householdId: string): Promise<Chore[]> => {
  try {
    // Return mock data for development
    if (process.env.NODE_ENV === 'development') {
      return mockChores.filter((chore) => chore.household_id === householdId);
    }

    const response = await axios.get(
      `${API_URL}/chores?household_id=${householdId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chores:', error);
    throw error;
  }
};

export const getChoreById = async (id: string): Promise<Chore> => {
  try {
    // Return mock data for development
    if (process.env.NODE_ENV === 'development') {
      const chore = mockChores.find((chore) => chore.id === id);
      if (chore) {
        return chore;
      }
      throw new Error(`Chore with id ${id} not found`);
    }

    const response = await axios.get(`${API_URL}/chores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chore with id ${id}:`, error);
    throw error;
  }
};

export const createChore = async (
  chore: Omit<Chore, 'id' | 'created_at' | 'updated_at'>
): Promise<Chore> => {
  try {
    const response = await axios.post(`${API_URL}/chores`, chore);
    return response.data;
  } catch (error) {
    console.error('Error creating chore:', error);
    throw error;
  }
};

export const updateChore = async (
  id: string,
  chore: Partial<Chore>
): Promise<Chore> => {
  try {
    const response = await axios.put(`${API_URL}/chores/${id}`, chore);
    return response.data;
  } catch (error) {
    console.error(`Error updating chore with id ${id}:`, error);
    throw error;
  }
};

export const deleteChore = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/chores/${id}`);
  } catch (error) {
    console.error(`Error deleting chore with id ${id}:`, error);
    throw error;
  }
};
