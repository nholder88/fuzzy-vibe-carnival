import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Chore,
  ChoreFormData,
  ChoreFilterOptions,
  HouseholdMember,
  ChoreCategory,
} from '@/types/chores';
import { choreService } from '@/lib/services/chore-service';

interface ChoresContextType {
  chores: Chore[];
  isLoading: boolean;
  error: string | null;
  householdMembers: HouseholdMember[];
  categories: ChoreCategory[];
  filters: ChoreFilterOptions;
  setFilters: (filters: ChoreFilterOptions) => void;
  fetchChores: (householdId: string) => Promise<void>;
  addChore: (householdId: string, chore: ChoreFormData) => Promise<void>;
  updateChore: (id: string, chore: Partial<ChoreFormData>) => Promise<void>;
  deleteChore: (id: string) => Promise<void>;
  markChoreAsCompleted: (id: string, completed: boolean) => Promise<void>;
}

const ChoresContext = createContext<ChoresContextType | undefined>(undefined);

export function useChores() {
  const context = useContext(ChoresContext);
  if (context === undefined) {
    throw new Error('useChores must be used within a ChoresProvider');
  }
  return context;
}

interface ChoresProviderProps {
  children: ReactNode;
}

export function ChoresProvider({ children }: ChoresProviderProps) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>(
    []
  );
  const [categories, setCategories] = useState<ChoreCategory[]>([]);
  const [filters, setFilters] = useState<ChoreFilterOptions>({});

  const fetchHouseholdMembers = async (householdId: string) => {
    try {
      const members = await choreService.getHouseholdMembers(householdId);
      setHouseholdMembers(members);
    } catch (err) {
      console.error('Error fetching household members:', err);
    }
  };

  const fetchCategories = async (householdId: string) => {
    try {
      const categories = await choreService.getChoreCategories(householdId);
      setCategories(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchChores = async (householdId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedChores = await choreService.getChores(householdId, filters);
      setChores(fetchedChores);
      await fetchHouseholdMembers(householdId);
      await fetchCategories(householdId);
    } catch (err) {
      setError('Failed to load chores. Please try again.');
      console.error('Error fetching chores:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addChore = async (householdId: string, chore: ChoreFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newChore = await choreService.createChore(householdId, chore);
      setChores((prev) => [...prev, newChore]);
    } catch (err) {
      setError('Failed to add chore. Please try again.');
      console.error('Error adding chore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChore = async (id: string, chore: Partial<ChoreFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedChore = await choreService.updateChore(id, chore);
      setChores((prev) => prev.map((c) => (c.id === id ? updatedChore : c)));
    } catch (err) {
      setError('Failed to update chore. Please try again.');
      console.error('Error updating chore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChore = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await choreService.deleteChore(id);
      setChores((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete chore. Please try again.');
      console.error('Error deleting chore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markChoreAsCompleted = async (id: string, completed: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedChore = await choreService.markChoreAsCompleted(
        id,
        completed
      );
      setChores((prev) => prev.map((c) => (c.id === id ? updatedChore : c)));
    } catch (err) {
      setError('Failed to update chore status. Please try again.');
      console.error('Error updating chore status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    chores,
    isLoading,
    error,
    householdMembers,
    categories,
    filters,
    setFilters,
    fetchChores,
    addChore,
    updateChore,
    deleteChore,
    markChoreAsCompleted,
  };

  return (
    <ChoresContext.Provider value={value}>{children}</ChoresContext.Provider>
  );
}
