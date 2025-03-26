import { TestBed } from '@angular/core/testing';
import { runInInjectionContext } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpHeaders,
} from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  const mockAuthService = {
    getAuthorizationHeader: jest.fn(),
  };

  let interceptor: HttpInterceptorFn;
  let req: HttpRequest<unknown>;
  let next: HttpHandlerFn;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });

    injector = TestBed;
    interceptor = authInterceptor;
    req = new HttpRequest('GET', '/api/test');
    next = jest.fn().mockReturnValue(of({}));

    // Reset mock before each test
    mockAuthService.getAuthorizationHeader.mockReset();
  });

  it('should add authorization header when token is available', () => {
    const authHeader = 'Bearer test-token';
    mockAuthService.getAuthorizationHeader.mockReturnValue(authHeader);

    runInInjectionContext(injector, () => {
      interceptor(req, next);

      const nextCalls = (next as jest.Mock).mock.calls;
      expect(nextCalls.length).toBe(1);
      const modifiedReq = nextCalls[0][0] as HttpRequest<unknown>;
      expect(modifiedReq.headers.get('Authorization')).toBe(authHeader);
    });
  });

  it('should not modify request when no token is available', () => {
    mockAuthService.getAuthorizationHeader.mockReturnValue(null);

    runInInjectionContext(injector, () => {
      interceptor(req, next);
      expect(next).toHaveBeenCalledWith(req);
    });
  });

  it('should preserve existing headers when adding authorization', () => {
    const authHeader = 'Bearer test-token';
    mockAuthService.getAuthorizationHeader.mockReturnValue(authHeader);
    const existingHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );
    req = new HttpRequest('GET', '/api/test', null, {
      headers: existingHeaders,
    });

    runInInjectionContext(injector, () => {
      interceptor(req, next);

      const modifiedReq = (next as jest.Mock).mock
        .calls[0][0] as HttpRequest<unknown>;
      expect(modifiedReq.headers.get('Content-Type')).toBe('application/json');
      expect(modifiedReq.headers.get('Authorization')).toBe(authHeader);
    });
  });
});
