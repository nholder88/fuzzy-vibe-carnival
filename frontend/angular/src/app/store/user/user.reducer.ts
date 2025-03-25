import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,

  on(UserActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loginSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null,
  })),

  on(UserActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.logout, () => ({
    ...initialUserState,
  })),

  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null,
  })),

  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
