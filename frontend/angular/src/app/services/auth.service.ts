import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterData } from '../models/user.model';
import { User } from '../store/user/user.state';
import { environment } from '../../environments/environment';
import Cookies from 'js-cookie';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.authServiceUrl}/auth`;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    if (this.isBrowser) {
      const storedUser =
        localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  getAuthorizationHeader(): string | null {
    if (this.isBrowser) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      return token ? `Bearer ${token}` : null;
    }
    return null;
  }

  login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .post<{ access_token: string; user: any }>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap({
          next: (response) => {
            const user: User = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name || response.user.email,
              householdId: response.user.householdId ?? '',
              isAuthenticated: true,
            };

            // Store auth data
            if (this.isBrowser) {
              const storage = rememberMe ? localStorage : sessionStorage;
              storage.setItem('token', response.access_token);
              storage.setItem('user', JSON.stringify(user));

              // Set cookie for middleware
              Cookies.set('token', response.access_token, {
                path: '/',
                expires: rememberMe ? 30 : undefined, // 30 days if remember me is checked
                secure: true,
                sameSite: 'strict',
              });
            }

            this.userSubject.next(user);
            this.loadingSubject.next(false);
            this.errorSubject.next(null);
          },
          error: (error) => this.handleError(error),
          complete: () => {
            this.loadingSubject.next(false);
          },
        }),
        map((response) => ({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || response.user.email,
          householdId: response.user.householdId ?? '',
          isAuthenticated: true,
        }))
      );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred during login';

    if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.status === 429) {
      errorMessage = 'Too many login attempts. Please try again later';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      Cookies.remove('token', { path: '/' });
    }

    this.userSubject.next(null);
    this.errorSubject.next(errorMessage);
    this.loadingSubject.next(false);
  }

  logout(): Observable<void> {
    // Clear stored data
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      Cookies.remove('token', { path: '/' });
    }

    this.userSubject.next(null);

    // Navigate to login
    this.router.navigate(['/login']);

    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<{ user: any }>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        if (response.user) {
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name || response.user.email,
            householdId: response.user.householdId ?? '',
            isAuthenticated: true,
          };
          this.userSubject.next(user);
        }
      }),
      map((response) => ({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name || response.user.email,
        householdId: response.user.householdId ?? '',
        isAuthenticated: true,
      }))
    );
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get error$(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  register(data: RegisterData): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .post<{ access_token: string; user: any }>(
        `${this.apiUrl}/register`,
        data
      )
      .pipe(
        tap({
          next: (response) => {
            const user: User = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name || response.user.email,
              householdId: response.user.householdId ?? '',
              isAuthenticated: true,
            };

            if (this.isBrowser) {
              sessionStorage.setItem('token', response.access_token);
              sessionStorage.setItem('user', JSON.stringify(user));

              Cookies.set('token', response.access_token, {
                path: '/',
                secure: true,
                sameSite: 'strict',
              });
            }

            this.userSubject.next(user);
            this.loadingSubject.next(false);
            this.errorSubject.next(null);
          },
          error: (error) => this.handleError(error),
          complete: () => {
            this.loadingSubject.next(false);
          },
        }),
        map((response) => ({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || response.user.email,
          householdId: response.user.householdId ?? '',
          isAuthenticated: true,
        }))
      );
  }
}
