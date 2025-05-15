import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  Household,
  HouseholdMember,
  HouseholdActivity,
} from '../../../models/household.model';
import {
  selectSelectedHousehold,
  selectHouseholdLoading,
  selectHouseholdError,
  selectHouseholdActivities,
  selectIsHouseholdAdmin,
} from '../../../store/household/household.selectors';
import * as HouseholdActions from '../../../store/household/household.actions';
import { AddMemberModalComponent } from '../add-member-modal/add-member-modal.component';
import { selectCurrentUser } from '../../../store/user/user.selectors';
import { map, combineLatest } from 'rxjs/operators';

@Component({
  selector: 'app-household-detail',
  standalone: true,
  imports: [CommonModule, AddMemberModalComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex items-center mb-6">
        <button
          class="text-blue-500 hover:text-blue-700 mr-4"
          (click)="goBack()"
        >
          ← Back
        </button>
        <h1 class="text-2xl font-bold">Household Details</h1>
      </div>

      <div *ngIf="loading$ | async" class="text-center py-4">
        Loading household details...
      </div>

      <div
        *ngIf="error$ | async as error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <div
        *ngIf="household$ | async as household"
        class="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <!-- Household Info -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">{{ household.name }}</h2>
            <p class="text-gray-600 mb-4">
              {{ household.description || 'No description' }}
            </p>
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-4"
                >Created: {{ household.createdAt | date }}</span
              >
              <span>Members: {{ household.members.length }}</span>
            </div>
          </div>

          <!-- Members Section -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Members</h3>
              <button
                *ngIf="isAdmin$ | async"
                class="text-blue-500 hover:text-blue-700"
                (click)="showAddMemberModal()"
              >
                Add Member
              </button>
            </div>
            <div class="space-y-4">
              <div
                *ngFor="let member of household.members"
                class="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3"
                  >
                    {{ member.user.firstName[0] }}{{ member.user.lastName[0] }}
                  </div>
                  <div>
                    <div class="font-medium">
                      {{ member.user.firstName }} {{ member.user.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ member.user.email }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-sm text-gray-500 mr-4">{{
                    member.role
                  }}</span>
                  <button
                    *ngIf="isAdmin$ | async"
                    class="text-red-500 hover:text-red-700"
                    (click)="removeMember(member.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div
                *ngFor="let activity of activities$ | async"
                class="p-3 bg-gray-50 rounded"
              >
                <div class="text-sm text-gray-500 mb-1">
                  {{ activity.createdAt | date : 'short' }}
                </div>
                <div class="font-medium">{{ activity.description }}</div>
                <div class="text-sm text-gray-500">
                  by {{ activity.user.firstName }} {{ activity.user.lastName }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Member Modal -->
      <app-add-member-modal
        *ngIf="showModal"
        [householdId]="householdId"
        (close)="hideAddMemberModal()"
      ></app-add-member-modal>
    </div>
  `,
  styles: [],
})
export class HouseholdDetailComponent implements OnInit {
  household$: Observable<Household | null>;
  activities$: Observable<HouseholdActivity[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  isAdmin$: Observable<boolean>;
  showModal = false;
  householdId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.household$ = this.store.select(selectSelectedHousehold);
    this.activities$ = this.store.select(selectHouseholdActivities);
    this.loading$ = this.store.select(selectHouseholdLoading);
    this.error$ = this.store.select(selectHouseholdError);
    this.isAdmin$ = this.store.select(selectCurrentUser).pipe(
      combineLatest(this.store.select(selectSelectedHousehold)),
      map(([user, household]) => {
        if (!user || !household) return false;
        return household.members.some(
          (member) => member.userId === user.id && member.role === 'ADMIN'
        );
      })
    );
  }

  ngOnInit(): void {
    const householdId = this.route.snapshot.paramMap.get('id');
    if (householdId) {
      this.householdId = householdId;
      this.store.dispatch(HouseholdActions.loadHouseholds());
      this.store.dispatch(HouseholdActions.loadActivities({ householdId }));
    }
  }

  goBack(): void {
    this.router.navigate(['/households']);
  }

  showAddMemberModal(): void {
    this.showModal = true;
  }

  hideAddMemberModal(): void {
    this.showModal = false;
  }

  removeMember(memberId: string): void {
    if (this.householdId) {
      this.store.dispatch(
        HouseholdActions.removeMember({
          householdId: this.householdId,
          memberId,
        })
      );
    }
  }
}
