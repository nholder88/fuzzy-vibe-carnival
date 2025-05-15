import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as UserActions from '../../../store/user/user.actions';
import * as UserSelectors from '../../../store/user/user.selectors';
import { UserState } from '../../../store/user/user.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
  ],
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<{ user: UserState }>,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });

    // Subscribe to store selectors
    this.store
      .select(UserSelectors.selectUserLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.store
      .select(UserSelectors.selectUserError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.error = error;
      });

    // Redirect on successful login
    this.store
      .select(UserSelectors.selectIsAuthenticated)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/']);
        }
      });
  }

  getErrorMessage(): string {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'Email is required';
    }
    if (this.loginForm.get('email')?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'Password is required';
    }
    if (this.loginForm.get('password')?.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;
    this.store.dispatch(UserActions.login({ email, password, rememberMe }));
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
