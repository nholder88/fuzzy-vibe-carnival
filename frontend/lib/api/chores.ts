import axios from 'axios';
import { Chore } from '../types';

const API_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getChores = async (householdId: string): Promise<Chore[]> => {
  try {
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
