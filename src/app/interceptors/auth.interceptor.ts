import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor - Automatically attaches Basic Auth credentials to outgoing HTTP requests
 *
 * This interceptor adds the Authorization header with Base64-encoded credentials
 * to all API requests, so you don't need to manually add it in each service.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const credentials = authService.getCredentials();

  // Skip adding credentials for public endpoints (login, register)
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // If we have credentials, clone the request and add the Authorization header
  if (credentials) {
    req = req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    });
  }

  return next(req);
};
