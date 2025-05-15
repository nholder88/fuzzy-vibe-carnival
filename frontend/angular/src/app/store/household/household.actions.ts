import { createAction, props } from '@ngrx/store';
import {
  Household,
  HouseholdMember,
  HouseholdActivity,
} from '../../models/household.model';

// Load Households
export const loadHouseholds = createAction('[Household] Load Households');

export const loadHouseholdsSuccess = createAction(
  '[Household] Load Households Success',
  props<{ households: Household[] }>()
);

export const loadHouseholdsFailure = createAction(
  '[Household] Load Households Failure',
  props<{ error: any }>()
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
  props<{ error: any }>()
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
  props<{ error: any }>()
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
  props<{ error: any }>()
);

// Member Management
export const addMember = createAction(
  '[Household] Add Member',
  props<{ householdId: string; email: string; role: string }>()
);

export const addMemberSuccess = createAction(
  '[Household] Add Member Success',
  props<{ member: HouseholdMember }>()
);

export const addMemberFailure = createAction(
  '[Household] Add Member Failure',
  props<{ error: any }>()
);

export const removeMember = createAction(
  '[Household] Remove Member',
  props<{ householdId: string; memberId: string }>()
);

export const removeMemberSuccess = createAction(
  '[Household] Remove Member Success',
  props<{ householdId: string; memberId: string }>()
);

export const removeMemberFailure = createAction(
  '[Household] Remove Member Failure',
  props<{ error: any }>()
);

// Activity Tracking
export const loadActivities = createAction(
  '[Household] Load Activities',
  props<{ householdId: string }>()
);

export const loadActivitiesSuccess = createAction(
  '[Household] Load Activities Success',
  props<{ activities: HouseholdActivity[] }>()
);

export const loadActivitiesFailure = createAction(
  '[Household] Load Activities Failure',
  props<{ error: any }>()
);

// Select Household
export const selectHousehold = createAction(
  '[Household] Select Household',
  props<{ householdId: string }>()
);
