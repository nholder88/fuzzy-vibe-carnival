import axios from 'axios';
import { Chore, ChoreFormData, ChoreFilterOptions } from '@/types/chores';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const choreService = {
  async getChores(
    householdId: string,
    filters?: ChoreFilterOptions
  ): Promise<Chore[]> {
    try {
      const params = { householdId, ...filters };
      const response = await axios.get(`${API_URL}/chores`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching chores:', error);
      // Return mock data for development purposes
      return mockChores;
    }
  },

  async getChoreById(id: string): Promise<Chore> {
    try {
      const response = await axios.get(`${API_URL}/chores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chore ${id}:`, error);
      return mockChores.find((c) => c.id === id) || mockChores[0];
    }
  },

  async createChore(
    householdId: string,
    choreData: ChoreFormData
  ): Promise<Chore> {
    try {
      const response = await axios.post(`${API_URL}/chores`, {
        ...choreData,
        householdId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating chore:', error);
      throw error;
    }
  },

  async updateChore(
    id: string,
    choreData: Partial<ChoreFormData>
  ): Promise<Chore> {
    try {
      const response = await axios.put(`${API_URL}/chores/${id}`, choreData);
      return response.data;
    } catch (error) {
      console.error(`Error updating chore ${id}:`, error);
      throw error;
    }
  },

  async deleteChore(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/chores/${id}`);
    } catch (error) {
      console.error(`Error deleting chore ${id}:`, error);
      throw error;
    }
  },

  async markChoreAsCompleted(id: string, completed: boolean): Promise<Chore> {
    try {
      const response = await axios.patch(`${API_URL}/chores/${id}/status`, {
        completed,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating chore status ${id}:`, error);
      throw error;
    }
  },

  async updateChoreStatus(
    id: string,
    status: 'pending' | 'in_progress' | 'completed'
  ): Promise<Chore> {
    try {
      // Determine if completed based on status
      const completed = status === 'completed';

      const response = await axios.patch(`${API_URL}/chores/${id}/status`, {
        status,
        completed_at: completed ? new Date().toISOString() : null,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating chore status ${id}:`, error);
      throw error;
    }
  },

  async getHouseholdMembers(householdId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/households/${householdId}/members`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching household members:', error);
      return mockHouseholdMembers;
    }
  },

  async getChoreCategories(householdId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/chores/categories?householdId=${householdId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching chore categories:', error);
      return mockCategories;
    }
  },
};

// Mock data for development and testing
const mockHouseholdMembers = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: '2',
    name: 'Sam Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  },
  {
    id: '3',
    name: 'Jamie Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
  },
  {
    id: '4',
    name: 'Taylor Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
  },
];

const mockCategories = [
  { id: '1', name: 'Kitchen' },
  { id: '2', name: 'Bathroom' },
  { id: '3', name: 'Living Room' },
  { id: '4', name: 'Bedroom' },
  { id: '5', name: 'Outdoor' },
  { id: '6', name: 'General' },
];

const mockChores: Chore[] = [
  {
    id: '1',
    title: 'Clean kitchen counters',
    description: 'Wipe down all kitchen counters with disinfectant',
    assignedTo: '1',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    completed: false,
    recurring: true,
    recurrencePattern: 'daily',
    priority: 'medium',
    category: 'Kitchen',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Vacuum living room',
    description: 'Vacuum carpet and under furniture',
    assignedTo: '2',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    completed: false,
    recurring: true,
    recurrencePattern: 'weekly',
    priority: 'low',
    category: 'Living Room',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Take out trash',
    description: 'Collect all trash bags and take to outdoor bins',
    assignedTo: '3',
    dueDate: new Date(Date.now() + 43200000).toISOString(),
    completed: true,
    recurring: true,
    recurrencePattern: 'daily',
    priority: 'high',
    category: 'General',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Clean bathroom',
    description: 'Clean toilet, sink, and shower',
    assignedTo: '4',
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    completed: false,
    recurring: true,
    recurrencePattern: 'weekly',
    priority: 'medium',
    category: 'Bathroom',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Mow the lawn',
    description: 'Mow front and back yard',
    assignedTo: '1',
    dueDate: new Date(Date.now() + 604800000).toISOString(),
    completed: false,
    recurring: true,
    recurrencePattern: 'biweekly',
    priority: 'low',
    category: 'Outdoor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
