export interface Chore {
  id: string;
  title: string;
  description: string;
  assignedTo: string | null;
  dueDate: string | null;
  completed: boolean;
  recurring: boolean;
  recurrencePattern?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChoreFormData {
  title: string;
  description: string;
  assignedTo: string | null;
  dueDate: string | null;
  recurring: boolean;
  recurrencePattern?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export type ChoreFilterOptions = {
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  category?: string;
  dueDate?: string;
};

export interface HouseholdMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChoreCategory {
  id: string;
  name: string;
}
