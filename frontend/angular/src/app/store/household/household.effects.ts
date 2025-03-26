import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as HouseholdActions from './household.actions';
import { HouseholdService } from '../../services/household.service';

@Injectable()
export class HouseholdEffects {
  private actions$ = inject(Actions);
  private householdService = inject(HouseholdService);

  loadHouseholds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseholdActions.loadHouseholds),
      mergeMap(() =>
        this.householdService.getHouseholds().pipe(
          map((households) =>
            HouseholdActions.loadHouseholdsSuccess({ households })
          ),
          catchError((error) =>
            of(HouseholdActions.loadHouseholdsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createHousehold$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseholdActions.createHousehold),
      mergeMap(({ name, description }) =>
        this.householdService.createHousehold({ name, description }).pipe(
          map((household) =>
            HouseholdActions.createHouseholdSuccess({ household })
          ),
          catchError((error) =>
            of(
              HouseholdActions.createHouseholdFailure({ error: error.message })
            )
          )
        )
      )
    )
  );

  updateHousehold$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseholdActions.updateHousehold),
      mergeMap(({ id, changes }) =>
        this.householdService.updateHousehold(id, changes).pipe(
          map((household) =>
            HouseholdActions.updateHouseholdSuccess({ household })
          ),
          catchError((error) =>
            of(
              HouseholdActions.updateHouseholdFailure({ error: error.message })
            )
          )
        )
      )
    )
  );

  deleteHousehold$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseholdActions.deleteHousehold),
      mergeMap(({ id }) =>
        this.householdService.deleteHousehold(id).pipe(
          map(() => HouseholdActions.deleteHouseholdSuccess({ id })),
          catchError((error) =>
            of(
              HouseholdActions.deleteHouseholdFailure({ error: error.message })
            )
          )
        )
      )
    )
  );
}
