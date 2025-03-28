import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
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
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  getAuthorizationHeader(): string | null {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      return token ? `Bearer ${token}` : null;
    }
    return null;
  }

  login(email: string, password: string): Observable<User> {
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
              localStorage.setItem('token', response.access_token);
              localStorage.setItem('user', JSON.stringify(user));

              // Set cookie for middleware
              Cookies.set('token', response.access_token, {
                path: '/',
                expires: 7,
                secure: true,
                sameSite: 'strict',
              });
            }

            this.userSubject.next(user);
            this.loadingSubject.next(false);
            this.errorSubject.next(null);
          },
          error: (error) => {
            if (this.isBrowser) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              Cookies.remove('token', { path: '/' });
            }
            this.userSubject.next(null);
            this.errorSubject.next(error.error?.message || 'Login failed');
            this.loadingSubject.next(false);
          },
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

  logout(): Observable<void> {
    // Clear stored data
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
              localStorage.setItem('token', response.access_token);
              localStorage.setItem('user', JSON.stringify(user));

              Cookies.set('token', response.access_token, {
                path: '/',
                expires: 7,
                secure: true,
                sameSite: 'strict',
              });
            }

            this.userSubject.next(user);
            this.loadingSubject.next(false);
            this.errorSubject.next(null);
          },
          error: (error) => {
            if (this.isBrowser) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              Cookies.remove('token', { path: '/' });
            }
            this.userSubject.next(null);
            this.errorSubject.next(
              error.error?.message || 'Registration failed'
            );
            this.loadingSubject.next(false);
          },
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
