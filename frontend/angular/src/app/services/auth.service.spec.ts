import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { User } from '../store/user/user.state';
import { PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    isAuthenticated: true,
  };

  const mockLoginResponse = {
    access_token: 'mock-token',
    user: mockUser,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login request and handle successful response', (done) => {
      const loginSubscription = service
        .login('test@example.com', 'password123')
        .subscribe({
          next: (user) => {
            try {
              expect(user).toEqual(mockUser);
              expect(localStorage.getItem('token')).toBe('mock-token');
              expect(localStorage.getItem('user')).toBe(
                JSON.stringify(mockUser)
              );
              expect(service.isAuthenticated).toBe(true);
              loginSubscription.unsubscribe();
              done();
            } catch (error) {
              loginSubscription.unsubscribe();
              done();
              fail(error);
            }
          },
          error: (error) => {
            loginSubscription.unsubscribe();
            done();
            fail(error);
          },
        });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });

    it('should handle login error', (done) => {
      const errorMessage = 'Invalid credentials';
      const loginSubscription = service
        .login('test@example.com', 'wrong-password')
        .subscribe({
          next: () => {
            loginSubscription.unsubscribe();
            done();
            fail('Expected error but got success');
          },
          error: (error: HttpErrorResponse) => {
            try {
              expect(error.error.message).toBe(errorMessage);
              expect(localStorage.getItem('token')).toBeNull();
              expect(localStorage.getItem('user')).toBeNull();
              expect(service.isAuthenticated).toBe(false);
              loginSubscription.unsubscribe();
              done();
            } catch (error) {
              loginSubscription.unsubscribe();
              done();
              fail(error);
            }
          },
        });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(
        { message: errorMessage },
        { status: 401, statusText: 'Unauthorized' }
      );
    });

    it('should clear error on new login attempt', (done) => {
      let errorChecked = false;
      let errorSubscription: Subscription;

      // First trigger an error
      service.login('test@example.com', 'wrong-password').subscribe({
        error: () => {
          // Now subscribe to error$ to check if it's cleared on next attempt
          errorSubscription = service.error$.subscribe((error) => {
            if (!errorChecked) {
              try {
                expect(error).toBeNull();
                errorChecked = true;
                errorSubscription.unsubscribe();
                done();
              } catch (error) {
                errorSubscription.unsubscribe();
                done();
                fail(error);
              }
            }
          });

          // Attempt login again
          service.login('test@example.com', 'password123').subscribe({
            error: (error) => {
              errorSubscription.unsubscribe();
              done();
              fail(error);
            },
          });
        },
      });

      // Handle first request (error)
      const firstReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      firstReq.flush(
        { message: 'Invalid credentials' },
        { status: 401, statusText: 'Unauthorized' }
      );

      // Handle second request (success)
      const secondReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      secondReq.flush(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should clear auth data and send logout request', (done) => {
      // First login to set up the state
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      service['userSubject'].next(mockUser);

      const logoutSubscription = service.logout().subscribe({
        next: () => {
          try {
            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
            expect(service.isAuthenticated).toBe(false);
            logoutSubscription.unsubscribe();
            done();
          } catch (error) {
            logoutSubscription.unsubscribe();
            done();
            fail(error);
          }
        },
        error: (error) => {
          logoutSubscription.unsubscribe();
          done();
          fail(error);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch and update current user', (done) => {
      const getCurrentUserSubscription = service.getCurrentUser().subscribe({
        next: (user) => {
          try {
            expect(user).toEqual(mockUser);
            getCurrentUserSubscription.unsubscribe();
            done();
          } catch (error) {
            getCurrentUserSubscription.unsubscribe();
            done();
            fail(error);
          }
        },
        error: (error) => {
          getCurrentUserSubscription.unsubscribe();
          done();
          fail(error);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush({ user: mockUser });
    });
  });
});
