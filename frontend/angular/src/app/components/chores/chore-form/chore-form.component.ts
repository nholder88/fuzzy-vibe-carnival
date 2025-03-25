import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChoresService, Chore } from '../../../services/chores.service';

@Component({
  selector: 'app-chore-form',
  templateUrl: './chore-form.component.html',
  styleUrls: ['./chore-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
})
export class ChoreFormComponent {
  choreForm: FormGroup;
  isEditMode = false;
  choreId: string | null = null;

  // Mock household members for now
  householdMembers = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Mary' },
    { id: '3', name: 'Robert' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private choresService: ChoresService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.choreForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dueDate: [new Date(), [Validators.required]],
      assignedTo: ['', [Validators.required]],
    });

    // Check if we're in edit mode
    this.route.paramMap.subscribe((params) => {
      this.choreId = params.get('id');
      if (this.choreId) {
        this.isEditMode = true;
        this.loadChoreData(this.choreId);
      }
    });
  }

  loadChoreData(id: string): void {
    this.choresService.getChore(id).subscribe({
      next: (chore) => {
        if (chore) {
          this.choreForm.patchValue({
            title: chore.title,
            description: chore.description,
            dueDate: new Date(chore.dueDate),
            assignedTo: chore.assignedTo,
          });
        } else {
          this.snackBar.open('Chore not found', 'Dismiss', {
            duration: 3000,
          });
          this.router.navigate(['/chores']);
        }
      },
      error: (error) => {
        console.error('Error loading chore:', error);
        this.snackBar.open('Error loading chore data', 'Dismiss', {
          duration: 3000,
        });
        this.router.navigate(['/chores']);
      },
    });
  }

  onSubmit(): void {
    if (this.choreForm.invalid) {
      return;
    }

    const choreData = {
      ...this.choreForm.value,
      status: 'pending', // Default status for new chores
    };

    if (this.isEditMode && this.choreId) {
      // Update existing chore
      this.choresService.updateChore(this.choreId, choreData).subscribe({
        next: (chore) => {
          if (chore) {
            this.snackBar.open('Chore updated successfully', 'Dismiss', {
              duration: 3000,
            });
            this.router.navigate(['/chores']);
          }
        },
        error: (error) => {
          console.error('Error updating chore:', error);
          this.snackBar.open('Error updating chore', 'Dismiss', {
            duration: 3000,
          });
        },
      });
    } else {
      // Create new chore
      this.choresService.createChore(choreData).subscribe({
        next: (chore) => {
          this.snackBar.open('Chore created successfully', 'Dismiss', {
            duration: 3000,
          });
          this.router.navigate(['/chores']);
        },
        error: (error) => {
          console.error('Error creating chore:', error);
          this.snackBar.open('Error creating chore', 'Dismiss', {
            duration: 3000,
          });
        },
      });
    }
  }
}
