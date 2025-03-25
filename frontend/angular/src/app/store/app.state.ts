import { UserState, initialUserState } from './user/user.state';
import {
  HouseholdState,
  initialHouseholdState,
} from './household/household.state';
import { ChoresState, initialChoresState } from './chores/chores.state';

export interface AppState {
  user: UserState;
  household: HouseholdState;
  chores: ChoresState;
  // We'll add specific feature states here as we implement them
}

export const initialAppState: AppState = {
  user: initialUserState,
  household: initialHouseholdState,
  chores: initialChoresState,
};
