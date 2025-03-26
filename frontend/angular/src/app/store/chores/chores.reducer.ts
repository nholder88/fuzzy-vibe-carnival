import { createReducer, on } from '@ngrx/store';
import * as ChoresActions from './chores.actions';
import { ChoresState, initialChoresState } from './chores.state';

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
