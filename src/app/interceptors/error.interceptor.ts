import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Error Interceptor - Handles HTTP errors globally
 *
 * Features:
 * - Automatically logs out user on 401 (Unauthorized - invalid Basic Auth credentials)
 * - Redirects to home on 403 (Forbidden - insufficient permissions)
 * - Handles network errors and CORS issues
 * - Provides consistent error handling across the app
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - Basic Auth credentials invalid or expired
        console.warn('Error Interceptor: 401 Unauthorized - Invalid credentials, logging out');
        authService.logout();
        router.navigate(['/'], {
          queryParams: { error: 'session_expired' }
        });
      } else if (error.status === 403) {
        // Forbidden - user doesn't have permission for this resource
        console.warn('Error Interceptor: 403 Forbidden - Insufficient permissions');
        router.navigate(['/'], {
          queryParams: { error: 'forbidden' }
        });
      } else if (error.status === 0) {
        // Network error or CORS issue
        console.error('Error Interceptor: Network error or CORS issue', error);
      } else if (error.status === 404) {
        // Not Found - log but don't redirect (component should handle)
        console.warn('Error Interceptor: 404 Not Found -', req.url);
      } else if (error.status >= 500) {
        // Server error
        console.error('Error Interceptor: Server error', error.status, error.message);
      }

      // Re-throw the error so services can still handle it if needed
      return throwError(() => error);
    })
  );
};
