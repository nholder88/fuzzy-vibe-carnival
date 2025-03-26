import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authHeader = authService.getAuthorizationHeader();

  if (authHeader) {
    const authRequest = req.clone({
      setHeaders: {
        Authorization: authHeader,
      },
    });
    return next(authRequest);
  }

  return next(req);
};
