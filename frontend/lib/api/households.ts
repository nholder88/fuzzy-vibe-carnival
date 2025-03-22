import axios from 'axios';
import { Household } from '@/lib/types';

// API URL should be set in your environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Create a new household
 */
export async function createHousehold(name: string): Promise<Household> {
  try {
    const response = await axios.post(`${API_URL}/households`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating household:', error);
    throw error;
  }
}

/**
 * Get all households for the current user
 */
export async function getHouseholds(): Promise<Household[]> {
  try {
    const response = await axios.get(`${API_URL}/households`);
    return response.data;
  } catch (error) {
    console.error('Error fetching households:', error);
    throw error;
  }
}
