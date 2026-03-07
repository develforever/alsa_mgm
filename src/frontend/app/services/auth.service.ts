
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _isLoggedIn = signal<boolean>(false);
  isLoggedIn = this._isLoggedIn.asReadonly();


  checkAuth(): Observable<boolean> {
    return this.http.get<{ isAuthenticated: boolean }>('/api/auth/status').pipe(
      map(res => res.isAuthenticated),
      tap(status => this._isLoggedIn.set(status)),
      catchError(() => {
        this._isLoggedIn.set(false);
        return of(false);
      })
    );
  }

  loginWithGithub() {
    window.location.href = `/api/auth/github`;
  }

  logout() {
    this.http.get('/api/auth/logout').subscribe({
      next: () => {
        this._isLoggedIn.set(false);
        window.location.href = '/login';
      },
      error: (err) => console.error('Logout failed', err)
    });
  }
}