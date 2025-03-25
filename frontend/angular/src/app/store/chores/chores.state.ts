export interface Chore {
  id: string;
  householdId: string;
  title: string;
  description?: string;
  assignedTo: string | null; // User ID
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}

export interface ChoresState {
  chores: Chore[];
  selectedChore: Chore | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
  };
}

export const initialChoresState: ChoresState = {
  chores: [],
  selectedChore: null,
  loading: false,
  error: null,
  filters: {},
};
