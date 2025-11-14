import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

/**
 * Auth Guard - Protects routes that require authentication
 *
 * Checks if user has valid Basic Auth credentials stored.
 * Redirects to home page with return URL if not authenticated.
 *
 * Usage in routes:
 * { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) {
        // User is authenticated with Basic Auth credentials
        return true;
      } else {
        // User is not authenticated, redirect to home
        console.warn('Auth Guard: User not authenticated, redirecting to home');
        router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};
