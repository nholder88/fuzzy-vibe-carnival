import { createReducer, on } from '@ngrx/store';
import { HouseholdState, initialHouseholdState } from './household.state';
import * as HouseholdActions from './household.actions';

export const householdReducer = createReducer(
  initialHouseholdState,

  // Load Households
  on(HouseholdActions.loadHouseholds, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HouseholdActions.loadHouseholdsSuccess, (state, { households }) => ({
    ...state,
    households,
    loading: false,
    error: null,
  })),

  on(HouseholdActions.loadHouseholdsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Household
  on(HouseholdActions.createHousehold, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HouseholdActions.createHouseholdSuccess, (state, { household }) => ({
    ...state,
    households: [...state.households, household],
    loading: false,
    error: null,
  })),

  on(HouseholdActions.createHouseholdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Household
  on(HouseholdActions.updateHousehold, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HouseholdActions.updateHouseholdSuccess, (state, { household }) => ({
    ...state,
    households: state.households.map((h) =>
      h.id === household.id ? household : h
    ),
    selectedHousehold:
      state.selectedHousehold?.id === household.id
        ? household
        : state.selectedHousehold,
    loading: false,
    error: null,
  })),

  on(HouseholdActions.updateHouseholdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Household
  on(HouseholdActions.deleteHousehold, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HouseholdActions.deleteHouseholdSuccess, (state, { id }) => ({
    ...state,
    households: state.households.filter((h) => h.id !== id),
    selectedHousehold:
      state.selectedHousehold?.id === id ? null : state.selectedHousehold,
    loading: false,
    error: null,
  })),

  on(HouseholdActions.deleteHouseholdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select Household
  on(HouseholdActions.selectHousehold, (state, { householdId }) => ({
    ...state,
    selectedHousehold:
      state.households.find((h) => h.id === householdId) || null,
  }))
);
