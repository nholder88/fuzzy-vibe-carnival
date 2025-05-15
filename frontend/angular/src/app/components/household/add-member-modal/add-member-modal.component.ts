import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectHouseholdLoading,
  selectHouseholdError,
} from '../../../store/household/household.selectors';
import * as HouseholdActions from '../../../store/household/household.actions';
import { HouseholdRole } from '../../../models/household.model';

@Component({
  selector: 'app-add-member-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Add New Member
          </h3>

          <form [formGroup]="memberForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email Address</label
              >
              <input
                type="email"
                id="email"
                formControlName="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [class.border-red-500]="
                  memberForm.get('email')?.invalid &&
                  memberForm.get('email')?.touched
                "
              />
              <div
                *ngIf="
                  memberForm.get('email')?.invalid &&
                  memberForm.get('email')?.touched
                "
                class="text-red-500 text-xs mt-1"
              >
                Please enter a valid email address
              </div>
            </div>

            <div class="mb-4">
              <label for="role" class="block text-sm font-medium text-gray-700"
                >Role</label
              >
              <select
                id="role"
                formControlName="role"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option [ngValue]="HouseholdRole.MEMBER">Member</option>
                <option [ngValue]="HouseholdRole.ADMIN">Admin</option>
              </select>
            </div>

            <div
              *ngIf="error$ | async as error"
              class="text-red-500 text-sm mb-4"
            >
              {{ error }}
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                (click)="onCancel()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                [disabled]="memberForm.invalid || (loading$ | async)"
              >
                {{ (loading$ | async) ? 'Adding...' : 'Add Member' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AddMemberModalComponent {
  @Input() householdId!: string;
  @Output() close = new EventEmitter<void>();

  memberForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  HouseholdRole = HouseholdRole;

  constructor(private fb: FormBuilder, private store: Store) {
    this.memberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: [HouseholdRole.MEMBER, Validators.required],
    });

    this.loading$ = this.store.select(selectHouseholdLoading);
    this.error$ = this.store.select(selectHouseholdError);
  }

  onSubmit(): void {
    if (this.memberForm.valid && this.householdId) {
      const { email, role } = this.memberForm.value;
      this.store.dispatch(
        HouseholdActions.addMember({
          householdId: this.householdId,
          email,
          role,
        })
      );
      this.close.emit();
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
