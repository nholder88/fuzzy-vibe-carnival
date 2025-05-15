import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Household } from '../../../models/household.model';
import {
  selectAllHouseholds,
  selectHouseholdLoading,
  selectHouseholdError,
} from '../../../store/household/household.selectors';
import * as HouseholdActions from '../../../store/household/household.actions';

@Component({
  selector: 'app-household-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Households</h1>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          routerLink="/households/create"
        >
          Create Household
        </button>
      </div>

      <div *ngIf="loading$ | async" class="text-center py-4">
        Loading households...
      </div>

      <div
        *ngIf="error$ | async as error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <div
        *ngIf="!(loading$ | async) && (households$ | async)?.length === 0"
        class="text-center py-4"
      >
        No households found. Create your first household to get started!
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          *ngFor="let household of households$ | async"
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold mb-2">{{ household.name }}</h2>
          <p class="text-gray-600 mb-4">
            {{ household.description || 'No description' }}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">
              {{ household.members.length }} members
            </span>
            <button
              class="text-blue-500 hover:text-blue-700"
              [routerLink]="['/households', household.id]"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class HouseholdListComponent implements OnInit {
  households$: Observable<Household[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private store: Store) {
    this.households$ = this.store.select(selectAllHouseholds);
    this.loading$ = this.store.select(selectHouseholdLoading);
    this.error$ = this.store.select(selectHouseholdError);
  }

  ngOnInit(): void {
    this.store.dispatch(HouseholdActions.loadHouseholds());
  }
}
