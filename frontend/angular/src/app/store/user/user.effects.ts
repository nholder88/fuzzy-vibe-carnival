import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as UserActions from './user.actions';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user) => UserActions.loginSuccess({ user })),
          catchError((error) =>
            of(
              UserActions.loginFailure({
                error: error.error?.message || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(() =>
        this.authService.getCurrentUser().pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) =>
            of(
              UserActions.loadUserFailure({
                error: error.error?.message || 'Failed to load user',
              })
            )
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.register),
      mergeMap(({ email, password, firstName, lastName }) =>
        this.authService
          .register({ email, password, firstName, lastName })
          .pipe(
            map((user) => UserActions.registerSuccess({ user })),
            catchError((error) =>
              of(
                UserActions.registerFailure({
                  error: error.error?.message || 'Registration failed',
                })
              )
            )
          )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
