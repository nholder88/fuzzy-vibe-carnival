import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChoresService } from '../../../services/chores.service';
import { Chore } from '../../../store/chores/chores.state';
import { selectCurrentUser } from '../../../store/user/user.selectors';
import { AppState } from '../../../store/app.state';

@Component({
  selector: 'app-chores-list',
  templateUrl: './chores-list.component.html',
  styleUrls: ['./chores-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
  ],
})
export class ChoresListComponent implements OnInit, OnDestroy {
  chores: Chore[] = [];
  displayedColumns: string[] = [
    'title',
    'assignedTo',
    'dueDate',
    'status',
    'actions',
  ];
  private destroy$ = new Subject<void>();

  constructor(
    private choresService: ChoresService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (!user?.householdId) {
          this.snackBar.open('No household found', 'Dismiss', {
            duration: 3000,
          });
          return;
        }
        this.loadChores(user.householdId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * The function `loadChores` fetches chores data using a service and handles
   * success and error cases accordingly.
   */
  loadChores(householdId: string): void {
    this.choresService.getChores(householdId).subscribe({
      next: (chores) => {
        this.chores = chores;
      },
      error: (error) => {
        console.error('Error loading chores:', error);
        this.snackBar.open('Error loading chores', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  toggleChoreStatus(id: string): void {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (!user?.householdId) {
          this.snackBar.open('No household found', 'Dismiss', {
            duration: 3000,
          });
          return;
        }

        this.choresService.completeChore(id).subscribe({
          next: (chore) => {
            this.loadChores(user.householdId);
            const status =
              chore.status === 'completed'
                ? 'marked as completed'
                : 'marked as pending';
            this.snackBar.open(`Chore ${status}`, 'Dismiss', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Error updating chore status:', error);
            this.snackBar.open('Error updating chore status', 'Dismiss', {
              duration: 3000,
            });
          },
        });
      });
  }

  deleteChore(id: string): void {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (!user?.householdId) {
          this.snackBar.open('No household found', 'Dismiss', {
            duration: 3000,
          });
          return;
        }

        this.choresService.deleteChore(id).subscribe({
          next: () => {
            this.loadChores(user.householdId);
            this.snackBar.open('Chore deleted successfully', 'Dismiss', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Error deleting chore:', error);
            this.snackBar.open('Error deleting chore', 'Dismiss', {
              duration: 3000,
            });
          },
        });
      });
  }
}
