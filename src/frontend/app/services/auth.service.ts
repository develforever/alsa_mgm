
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of, Observable } from 'rxjs';
import { User } from '../../../shared/models/types';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _isLoggedIn = signal<boolean>(false);
  isLoggedIn = this._isLoggedIn.asReadonly();
  private _user = signal<User | undefined>(undefined);
  user = this._user.asReadonly();


  getUser() {
    return this.user();
  }

  checkAuth(): Observable<boolean> {
    return this.http.get<{ isAuthenticated: boolean, user?: User }>('/api/auth/status').pipe(
      map(res => {
        this._isLoggedIn.set(res.isAuthenticated);
        this._user.set(res.user);
        return res.isAuthenticated;
      }),
      catchError(() => {
        this._isLoggedIn.set(false);
        return of(false);
      })
    )
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