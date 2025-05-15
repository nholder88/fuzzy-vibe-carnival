import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectHouseholdLoading,
  selectHouseholdError,
} from '../../../store/household/household.selectors';
import * as HouseholdActions from '../../../store/household/household.actions';

@Component({
  selector: 'app-household-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4 max-w-2xl">
      <div class="flex items-center mb-6">
        <button
          class="text-blue-500 hover:text-blue-700 mr-4"
          (click)="goBack()"
        >
          ← Back
        </button>
        <h1 class="text-2xl font-bold">Create New Household</h1>
      </div>

      <form
        [formGroup]="householdForm"
        (ngSubmit)="onSubmit()"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">
            Household Name *
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="
              householdForm.get('name')?.invalid &&
              householdForm.get('name')?.touched
            "
          />
          <div
            *ngIf="
              householdForm.get('name')?.invalid &&
              householdForm.get('name')?.touched
            "
            class="text-red-500 text-xs italic mt-1"
          >
            Household name is required
          </div>
        </div>

        <div class="mb-6">
          <label
            for="description"
            class="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        <div
          *ngIf="error$ | async as error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {{ error }}
        </div>

        <div class="flex items-center justify-between">
          <button
            type="button"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            (click)="goBack()"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            [disabled]="householdForm.invalid || (loading$ | async)"
          >
            {{ (loading$ | async) ? 'Creating...' : 'Create Household' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class HouseholdCreateComponent {
  householdForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.householdForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });

    this.loading$ = this.store.select(selectHouseholdLoading);
    this.error$ = this.store.select(selectHouseholdError);
  }

  onSubmit(): void {
    if (this.householdForm.valid) {
      const { name, description } = this.householdForm.value;
      this.store.dispatch(
        HouseholdActions.createHousehold({
          name,
          description: description ?? '',
        })
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/households']);
  }
}
