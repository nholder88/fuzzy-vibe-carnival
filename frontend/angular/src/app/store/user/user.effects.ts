import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as UserActions from './user.actions';
import { AuthService } from '../../services/auth.service';
import { Action } from '@ngrx/store';

@Injectable()
export class UserEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      mergeMap(
        ({
          email,
          password,
          rememberMe,
        }: {
          email: string;
          password: string;
          rememberMe: boolean;
        }) =>
          this.authService.login(email, password, rememberMe).pipe(
            map((user: any) => UserActions.loginSuccess({ user })),
            catchError((error: any) =>
              of(UserActions.loginFailure({ error: error.message }))
            )
          )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loginSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => UserActions.logoutSuccess()),
          catchError((error: any) =>
            of(UserActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(() =>
        this.authService.getCurrentUser().pipe(
          map((user: any) => UserActions.loadUserSuccess({ user })),
          catchError((error: any) =>
            of(UserActions.loadUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.register),
      mergeMap(
        ({
          email,
          password,
          firstName,
          lastName,
        }: {
          email: string;
          password: string;
          firstName?: string;
          lastName?: string;
        }) =>
          this.authService
            .register({ email, password, firstName, lastName })
            .pipe(
              map((user: any) => UserActions.registerSuccess({ user })),
              catchError((error: any) =>
                of(UserActions.registerFailure({ error: error.message }))
              )
            )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.registerSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
