import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: any, next: any) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error.status === 401 && !req.url.includes('/api/auth/status')) {
        console.warn('Sesja wygasła lub brak uprawnień. Przekierowanie do logowania...');

        authService.logout();

        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};