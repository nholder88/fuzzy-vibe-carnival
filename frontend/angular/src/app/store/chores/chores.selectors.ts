import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChoresState, Chore } from './chores.state';

export const selectChoresState = createFeatureSelector<ChoresState>('chores');

export const selectAllChores = createSelector(
  selectChoresState,
  (state: ChoresState) => state.chores
);

export const selectSelectedChore = createSelector(
  selectChoresState,
  (state: ChoresState) => state.selectedChore
);

export const selectChoresLoading = createSelector(
  selectChoresState,
  (state: ChoresState) => state.loading
);

export const selectChoresError = createSelector(
  selectChoresState,
  (state: ChoresState) => state.error
);

export const selectChoresFilters = createSelector(
  selectChoresState,
  (state: ChoresState) => state.filters
);

export const selectFilteredChores = createSelector(
  selectAllChores,
  selectChoresFilters,
  (chores: Chore[], filters) => {
    return chores.filter((chore) => {
      const statusMatch =
        !filters.status?.length || filters.status.includes(chore.status);
      const priorityMatch =
        !filters.priority?.length || filters.priority.includes(chore.priority);
      const assigneeMatch =
        !filters.assignedTo?.length ||
        filters.assignedTo.includes(chore.assignedTo || '');
      return statusMatch && priorityMatch && assigneeMatch;
    });
  }
);

export const selectChoresByHousehold = (householdId: string) =>
  createSelector(selectFilteredChores, (chores) =>
    chores.filter((c) => c.householdId === householdId)
  );

export const selectChoreById = (id: string) =>
  createSelector(selectAllChores, (chores) => chores.find((c) => c.id === id));

export const selectPendingChores = createSelector(
  selectFilteredChores,
  (chores) => chores.filter((c) => c.status === 'pending')
);

export const selectCompletedChores = createSelector(
  selectFilteredChores,
  (chores) => chores.filter((c) => c.status === 'completed')
);

export const selectInProgressChores = createSelector(
  selectFilteredChores,
  (chores) => chores.filter((c) => c.status === 'in_progress')
);
