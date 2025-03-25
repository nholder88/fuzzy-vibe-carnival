import { createAction, props } from '@ngrx/store';
import { User } from './user.state';

export const login = createAction(
  '[User] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[User] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[User] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[User] Logout');

export const loadUser = createAction('[User] Load User');

export const loadUserSuccess = createAction(
  '[User] Load User Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[User] Load User Failure',
  props<{ error: string }>()
);
