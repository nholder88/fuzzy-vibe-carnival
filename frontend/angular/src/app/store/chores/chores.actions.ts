import { createAction, props } from '@ngrx/store';
import { Chore } from './chores.state';

// Load Chores
export const loadChores = createAction(
  '[Chores] Load Chores',
  props<{ householdId: string }>()
);

export const loadChoresSuccess = createAction(
  '[Chores] Load Chores Success',
  props<{ chores: Chore[] }>()
);

export const loadChoresFailure = createAction(
  '[Chores] Load Chores Failure',
  props<{ error: string }>()
);

// Create Chore
export const createChore = createAction(
  '[Chores] Create Chore',
  props<{
    householdId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
    };
  }>()
);

export const createChoreSuccess = createAction(
  '[Chores] Create Chore Success',
  props<{ chore: Chore }>()
);

export const createChoreFailure = createAction(
  '[Chores] Create Chore Failure',
  props<{ error: string }>()
);

// Update Chore
export const updateChore = createAction(
  '[Chores] Update Chore',
  props<{ id: string; changes: Partial<Chore> }>()
);

export const updateChoreSuccess = createAction(
  '[Chores] Update Chore Success',
  props<{ chore: Chore }>()
);

export const updateChoreFailure = createAction(
  '[Chores] Update Chore Failure',
  props<{ error: string }>()
);

// Delete Chore
export const deleteChore = createAction(
  '[Chores] Delete Chore',
  props<{ id: string }>()
);

export const deleteChoreSuccess = createAction(
  '[Chores] Delete Chore Success',
  props<{ id: string }>()
);

export const deleteChoreFailure = createAction(
  '[Chores] Delete Chore Failure',
  props<{ error: string }>()
);

// Complete Chore
export const completeChore = createAction(
  '[Chores] Complete Chore',
  props<{ id: string }>()
);

export const completeChoreSuccess = createAction(
  '[Chores] Complete Chore Success',
  props<{ chore: Chore }>()
);

export const completeChoreFailure = createAction(
  '[Chores] Complete Chore Failure',
  props<{ error: string }>()
);

// Select Chore
export const selectChore = createAction(
  '[Chores] Select Chore',
  props<{ choreId: string }>()
);

// Update Filters
export const updateFilters = createAction(
  '[Chores] Update Filters',
  props<{
    filters: {
      status?: string[];
      priority?: string[];
      assignedTo?: string[];
    };
  }>()
);
