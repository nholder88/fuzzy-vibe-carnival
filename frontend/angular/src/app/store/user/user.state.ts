export interface User {
  id: string;
  email: string;
  name: string;
  householdId: string;
  isAuthenticated: boolean;
}

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};
