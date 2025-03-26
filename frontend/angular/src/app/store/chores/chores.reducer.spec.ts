import { createReducer, on } from '@ngrx/store';
import * as ChoresActions from './chores.actions';
import { ChoresState, initialChoresState } from './chores.state';

describe('ChoresReducer', () => {
  const mockChore = {
    id: '1',
    householdId: '1',
    title: 'Test Chore',
    description: 'Test Description',
    assignedTo: null,
    dueDate: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'medium' as const,
    status: 'pending' as const,
  };

  it('should return the initial state', () => {
    const action = { type: 'NOOP' } as any;
    const state = choresReducer(undefined, action);

    expect(state).toBe(initialChoresState);
  });

  it('should handle loadChoresSuccess', () => {
    const chores = [mockChore];
    const action = ChoresActions.loadChoresSuccess({ chores });
    const state = choresReducer(initialChoresState, action);

    expect(state.chores).toEqual(chores);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle createChoreSuccess', () => {
    const action = ChoresActions.createChoreSuccess({ chore: mockChore });
    const state = choresReducer(initialChoresState, action);

    expect(state.chores).toContain(mockChore);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle updateChoreSuccess', () => {
    const initialState = {
      ...initialChoresState,
      chores: [mockChore],
    };
    const updatedChore = { ...mockChore, title: 'Updated Title' };
    const action = ChoresActions.updateChoreSuccess({ chore: updatedChore });
    const state = choresReducer(initialState, action);

    expect(state.chores[0]).toEqual(updatedChore);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle deleteChoreSuccess', () => {
    const initialState = {
      ...initialChoresState,
      chores: [mockChore],
    };
    const action = ChoresActions.deleteChoreSuccess({ id: mockChore.id });
    const state = choresReducer(initialState, action);

    expect(state.chores).not.toContain(mockChore);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle completeChoreSuccess', () => {
    const initialState = {
      ...initialChoresState,
      chores: [mockChore],
    };
    const completedChore = { ...mockChore, status: 'completed' as const };
    const action = ChoresActions.completeChoreSuccess({
      chore: completedChore,
    });
    const state = choresReducer(initialState, action);

    expect(state.chores[0].status).toBe('completed');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle updateFilters', () => {
    const filters = {
      status: ['pending'],
      priority: ['high'],
      assignedTo: ['user1'],
    };
    const action = ChoresActions.updateFilters({ filters });
    const state = choresReducer(initialChoresState, action);

    expect(state.filters).toEqual(filters);
  });
});

export const choresReducer = createReducer(
  initialChoresState,
  on(ChoresActions.loadChores, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ChoresActions.loadChoresSuccess, (state, { chores }) => ({
    ...state,
    chores,
    loading: false,
    error: null,
  })),
  on(ChoresActions.loadChoresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ChoresActions.createChoreSuccess, (state, { chore }) => ({
    ...state,
    chores: [...state.chores, chore],
    loading: false,
    error: null,
  })),
  on(ChoresActions.updateChoreSuccess, (state, { chore }) => ({
    ...state,
    chores: state.chores.map((c) => (c.id === chore.id ? chore : c)),
    loading: false,
    error: null,
  })),
  on(ChoresActions.deleteChoreSuccess, (state, { id }) => ({
    ...state,
    chores: state.chores.filter((c) => c.id !== id),
    loading: false,
    error: null,
  })),
  on(ChoresActions.completeChoreSuccess, (state, { chore }) => ({
    ...state,
    chores: state.chores.map((c) => (c.id === chore.id ? chore : c)),
    loading: false,
    error: null,
  })),
  on(ChoresActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters,
  }))
);
