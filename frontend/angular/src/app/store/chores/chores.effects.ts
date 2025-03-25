import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ChoresActions from './chores.actions';
import { ChoresService } from '../../services/chores.service';

@Injectable()
export class ChoresEffects {
  loadChores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChoresActions.loadChores),
      mergeMap(({ householdId }) =>
        this.choresService.getChores(householdId).pipe(
          map((chores) => ChoresActions.loadChoresSuccess({ chores })),
          catchError((error) =>
            of(ChoresActions.loadChoresFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createChore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChoresActions.createChore),
      mergeMap((choreData) =>
        this.choresService.createChore(choreData).pipe(
          map((chore) => ChoresActions.createChoreSuccess({ chore })),
          catchError((error) =>
            of(ChoresActions.createChoreFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateChore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChoresActions.updateChore),
      mergeMap(({ id, changes }) =>
        this.choresService.updateChore(id, changes).pipe(
          map((chore) => ChoresActions.updateChoreSuccess({ chore })),
          catchError((error) =>
            of(ChoresActions.updateChoreFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteChore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChoresActions.deleteChore),
      mergeMap(({ id }) =>
        this.choresService.deleteChore(id).pipe(
          map(() => ChoresActions.deleteChoreSuccess({ id })),
          catchError((error) =>
            of(ChoresActions.deleteChoreFailure({ error: error.message }))
          )
        )
      )
    )
  );

  completeChore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChoresActions.completeChore),
      mergeMap(({ id }) =>
        this.choresService.completeChore(id).pipe(
          map((chore) => ChoresActions.completeChoreSuccess({ chore })),
          catchError((error) =>
            of(ChoresActions.completeChoreFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private choresService: ChoresService
  ) {}
}
