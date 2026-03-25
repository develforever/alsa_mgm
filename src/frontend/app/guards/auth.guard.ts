
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Czekamy aż zasób skończy się ładować i zwracamy status
  return toObservable(authService.isLoggedIn).pipe(
    map(isLoggedIn => {
      if (!isLoggedIn) {
        return router.createUrlTree(['/login']);
      }
      return true;
    }),
    take(1)
  );
};