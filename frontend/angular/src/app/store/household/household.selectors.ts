import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HouseholdState } from './household.state';

export const selectHouseholdState =
  createFeatureSelector<HouseholdState>('household');

export const selectAllHouseholds = createSelector(
  selectHouseholdState,
  (state: HouseholdState) => state.households
);

export const selectSelectedHousehold = createSelector(
  selectHouseholdState,
  (state: HouseholdState) => state.selectedHousehold
);

export const selectHouseholdLoading = createSelector(
  selectHouseholdState,
  (state: HouseholdState) => state.loading
);

export const selectHouseholdError = createSelector(
  selectHouseholdState,
  (state: HouseholdState) => state.error
);

export const selectHouseholdById = (id: string) =>
  createSelector(selectAllHouseholds, (households) =>
    households.find((h) => h.id === id)
  );
