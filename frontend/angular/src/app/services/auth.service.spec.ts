import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { User } from '../store/user/user.state';

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
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login request and handle successful response', (done) => {
      service.login('test@example.com', 'password123').subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          expect(localStorage.getItem('token')).toBe('mock-token');
          expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
          expect(service.isAuthenticated).toBe(true);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });

      req.flush(mockLoginResponse);
    });

    it('should handle login error', (done) => {
      const errorMessage = 'Invalid credentials';

      service.login('test@example.com', 'wrong-password').subscribe({
        error: (error) => {
          expect(error.error.message).toBe(errorMessage);
          expect(localStorage.getItem('token')).toBeNull();
          expect(localStorage.getItem('user')).toBeNull();
          expect(service.isAuthenticated).toBe(false);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(
        { message: errorMessage },
        { status: 401, statusText: 'Unauthorized' }
      );
    });

    it('should clear error on new login attempt', (done) => {
      service.error$.subscribe((error) => {
        expect(error).toBeNull();
        done();
      });

      service.login('test@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockLoginResponse);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
    });

    it('should clear auth data and send logout request', (done) => {
      service.logout().subscribe(() => {
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(service.isAuthenticated).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch and update current user', (done) => {
      service.getCurrentUser().subscribe((user) => {
        expect(user).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush({ user: mockLoginResponse.user });
    });

    it('should handle getCurrentUser error', (done) => {
      const errorMessage = 'Failed to load user';

      service.getCurrentUser().subscribe({
        error: (error) => {
          expect(error.error.message).toBe(errorMessage);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      req.flush(
        { message: errorMessage },
        { status: 500, statusText: 'Server Error' }
      );
    });
  });
});
