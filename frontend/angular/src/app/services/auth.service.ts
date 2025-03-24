import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, RegisterData } from '../models/user.model';
import { environment } from '../../environments/environment';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check for stored token and user data
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData) as User;
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      this.loadingSubject.next(false);
    }
  }

  login(email: string, password: string): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .post<{ access_token: string; user: User }>(
        `${environment.apiUrl}/auth/login`,
        { email, password }
      )
      .pipe(
        tap({
          next: (response) => {
            const { access_token, user } = response;

            // Store auth data
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set cookie for middleware
            Cookies.set('token', access_token, {
              path: '/',
              expires: 7,
              sameSite: 'lax',
            });

            // Update user state
            this.userSubject.next(user);

            // Navigate to dashboard
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Login error:', error);
            this.errorSubject.next(
              error?.error?.message || 'Invalid credentials'
            );
          },
          complete: () => {
            this.loadingSubject.next(false);
          },
        })
      );
  }

  register(userData: RegisterData): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .post<any>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap({
          error: (error) => {
            console.error('Registration error:', error);
            this.errorSubject.next(
              error?.error?.message || 'Registration failed'
            );
            this.loadingSubject.next(false);
          },
        })
      );
  }

  logout(): void {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear the cookie
    Cookies.remove('token', { path: '/' });

    // Update state
    this.userSubject.next(null);

    // Navigate to login
    this.router.navigate(['/login']);
  }

  getAuthorizationHeader(): string | null {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
