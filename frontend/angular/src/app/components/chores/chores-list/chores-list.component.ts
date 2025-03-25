import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChoresService, Chore } from '../../../services/chores.service';

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
export class ChoresListComponent implements OnInit {
  chores: Chore[] = [];
  displayedColumns: string[] = [
    'title',
    'assignedTo',
    'dueDate',
    'status',
    'actions',
  ];

  constructor(
    private choresService: ChoresService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadChores();
  }

  loadChores(): void {
    this.choresService.getChores().subscribe({
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
    this.choresService.toggleChoreStatus(id).subscribe({
      next: (chore) => {
        if (chore) {
          this.loadChores();
          const status =
            chore.status === 'completed'
              ? 'marked as completed'
              : 'marked as pending';
          this.snackBar.open(`Chore ${status}`, 'Dismiss', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Error toggling chore status:', error);
        this.snackBar.open('Error updating chore', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  deleteChore(id: string): void {
    if (confirm('Are you sure you want to delete this chore?')) {
      this.choresService.deleteChore(id).subscribe({
        next: (success) => {
          if (success) {
            this.loadChores();
            this.snackBar.open('Chore deleted successfully', 'Dismiss', {
              duration: 3000,
            });
          }
        },
        error: (error) => {
          console.error('Error deleting chore:', error);
          this.snackBar.open('Error deleting chore', 'Dismiss', {
            duration: 3000,
          });
        },
      });
    }
  }
}
