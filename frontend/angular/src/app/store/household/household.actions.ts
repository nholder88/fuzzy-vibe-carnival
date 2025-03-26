import { createAction, props } from '@ngrx/store';
import { Household } from './household.state';

// Load Households
export const loadHouseholds = createAction('[Household] Load Households');

export const loadHouseholdsSuccess = createAction(
  '[Household] Load Households Success',
  props<{ households: Household[] }>()
);

export const loadHouseholdsFailure = createAction(
  '[Household] Load Households Failure',
  props<{ error: string }>()
);

// Create Household
export const createHousehold = createAction(
  '[Household] Create Household',
  props<{ name: string; description?: string }>()
);

export const createHouseholdSuccess = createAction(
  '[Household] Create Household Success',
  props<{ household: Household }>()
);

export const createHouseholdFailure = createAction(
  '[Household] Create Household Failure',
  props<{ error: string }>()
);

// Update Household
export const updateHousehold = createAction(
  '[Household] Update Household',
  props<{ id: string; changes: Partial<Household> }>()
);

export const updateHouseholdSuccess = createAction(
  '[Household] Update Household Success',
  props<{ household: Household }>()
);

export const updateHouseholdFailure = createAction(
  '[Household] Update Household Failure',
  props<{ error: string }>()
);

// Delete Household
export const deleteHousehold = createAction(
  '[Household] Delete Household',
  props<{ id: string }>()
);

export const deleteHouseholdSuccess = createAction(
  '[Household] Delete Household Success',
  props<{ id: string }>()
);

export const deleteHouseholdFailure = createAction(
  '[Household] Delete Household Failure',
  props<{ error: string }>()
);

// Select Household
export const selectHousehold = createAction(
  '[Household] Select Household',
  props<{ householdId: string }>()
);
