export interface Household {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: string[]; // User IDs
}

export interface HouseholdState {
  households: Household[];
  selectedHousehold: Household | null;
  loading: boolean;
  error: string | null;
}

export const initialHouseholdState: HouseholdState = {
  households: [],
  selectedHousehold: null,
  loading: false,
  error: null,
};
