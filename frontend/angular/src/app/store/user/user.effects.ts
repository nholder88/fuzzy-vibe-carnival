import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class UserEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user) => UserActions.loginSuccess({ user })),
          catchError((error) =>
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
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.loadUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
