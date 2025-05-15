import { createReducer, on } from '@ngrx/store';
import {
  Household,
  HouseholdMember,
  HouseholdActivity,
} from '../../models/household.model';
import * as HouseholdActions from './household.actions';

export interface HouseholdState {
  households: Household[];
  selectedHousehold: Household | null;
  activities: HouseholdActivity[];
  loading: boolean;
  error: any;
}

export const initialState: HouseholdState = {
  households: [],
  selectedHousehold: null,
  activities: [],
  loading: false,
  error: null,
};

export const householdReducer = createReducer(
  initialState,

  // Load Households
  on(HouseholdActions.loadHouseholds, (state: HouseholdState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    HouseholdActions.loadHouseholdsSuccess,
    (state: HouseholdState, { households }: { households: Household[] }) => ({
      ...state,
      households,
      loading: false,
    })
  ),
  on(
    HouseholdActions.loadHouseholdsFailure,
    (state: HouseholdState, { error }: { error: any }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Create Household
  on(HouseholdActions.createHousehold, (state: HouseholdState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    HouseholdActions.createHouseholdSuccess,
    (state: HouseholdState, { household }: { household: Household }) => ({
      ...state,
      households: [...state.households, household],
      loading: false,
    })
  ),
  on(
    HouseholdActions.createHouseholdFailure,
    (state: HouseholdState, { error }: { error: any }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Update Household
  on(HouseholdActions.updateHousehold, (state: HouseholdState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    HouseholdActions.updateHouseholdSuccess,
    (state: HouseholdState, { household }: { household: Household }) => ({
      ...state,
      households: state.households.map((h: Household) =>
        h.id === household.id ? household : h
      ),
      selectedHousehold:
        state.selectedHousehold?.id === household.id
          ? household
          : state.selectedHousehold,
      loading: false,
    })
  ),
  on(
    HouseholdActions.updateHouseholdFailure,
    (state: HouseholdState, { error }: { error: any }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Delete Household
  on(HouseholdActions.deleteHousehold, (state: HouseholdState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    HouseholdActions.deleteHouseholdSuccess,
    (state: HouseholdState, { id }: { id: string }) => ({
      ...state,
      households: state.households.filter((h: Household) => h.id !== id),
      selectedHousehold:
        state.selectedHousehold?.id === id ? null : state.selectedHousehold,
      loading: false,
    })
  ),
  on(
    HouseholdActions.deleteHouseholdFailure,
    (state: HouseholdState, { error }: { error: any }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Member Management
  on(
    HouseholdActions.addMemberSuccess,
    (state: HouseholdState, { member }: { member: HouseholdMember }) => ({
      ...state,
      households: state.households.map((h: Household) =>
        h.id === member.householdId
          ? { ...h, members: [...h.members, member] }
          : h
      ),
      selectedHousehold:
        state.selectedHousehold?.id === member.householdId
          ? {
              ...state.selectedHousehold,
              members: [...state.selectedHousehold.members, member],
            }
          : state.selectedHousehold,
    })
  ),

  on(
    HouseholdActions.addMemberFailure,
    (state: HouseholdState, { error }: { error: any }) => ({
      ...state,
      error,
      loading: false,
    })
  ),

  on(
    HouseholdActions.removeMemberSuccess,
    (
      state: HouseholdState,
      { householdId, memberId }: { householdId: string; memberId: string }
    ) => ({
      ...state,
      households: state.households.map((h: Household) =>
        h.id === householdId
          ? {
              ...h,
              members: h.members.filter(
                (m: HouseholdMember) => m.id !== memberId
              ),
            }
          : h
      ),
      selectedHousehold:
        state.selectedHousehold?.id === householdId
          ? {
              ...state.selectedHousehold,
              members: state.selectedHousehold.members.filter(
                (m: HouseholdMember) => m.id !== memberId
              ),
            }
          : state.selectedHousehold,
    })
  ),

  on(
    HouseholdActions.removeMemberFailure,
    (state: HouseholdState, { error }: { error: any }) => ({
      ...state,
      error,
      loading: false,
    })
  ),

  // Activity Tracking
  on(HouseholdActions.loadActivities, (state: HouseholdState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    HouseholdActions.loadActivitiesSuccess,
    (
      state: HouseholdState,
      { activities }: { activities: HouseholdActivity[] }
    ) => ({
      ...state,
      activities,
      loading: false,
    })
  ),
  on(
    HouseholdActions.loadActivitiesFailure,
    (state: HouseholdState, { error }: { error: any }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);
