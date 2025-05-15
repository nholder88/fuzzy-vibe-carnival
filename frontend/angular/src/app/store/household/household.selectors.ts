import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HouseholdState } from './household.reducer';
import { Household, HouseholdMember } from '../../models/household.model';

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

export const selectHouseholdActivities = createSelector(
  selectHouseholdState,
  (state: HouseholdState) => state.activities
);

export const selectHouseholdLoading = createSelector(
  selectHouseholdState,
  (state: HouseholdState) => state.loading
);

export const selectHouseholdError = createSelector(
  selectHouseholdState,
  (state: HouseholdState) => state.error
);

export const selectHouseholdMembers = createSelector(
  selectSelectedHousehold,
  (household: Household | null) => household?.members || []
);

export const selectIsHouseholdAdmin = createSelector(
  selectSelectedHousehold,
  (household: Household | null) => (userId: string) =>
    household?.members.some(
      (member: HouseholdMember) =>
        member.userId === userId && member.role === 'ADMIN'
    ) || false
);

export const selectHouseholdById = (id: string) =>
  createSelector(
    selectAllHouseholds,
    (households: Household[]) =>
      households.find((h: Household) => h.id === id) || null
  );
