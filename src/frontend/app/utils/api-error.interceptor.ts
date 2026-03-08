import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { ApiResponse } from '../../../shared/api/ApiResponse';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        tap((event) => {
            if (event instanceof HttpResponse) {
                const body = event.body as ApiResponse<any>;

                if (body && 'message' in body && 'code' in body && !('data' in body)) {
                    console.error('Przechwycono błąd API:', body.message);

                    snackBar.open(`Błąd: ${body.message}`, 'Zamknij', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                    throw body;
                }
            }
        })
    );
};