
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal przechowujący status zalogowania
  private _isLoggedIn = signal<boolean>(false);
  isLoggedIn = this._isLoggedIn.asReadonly();

  login() {
    // Tutaj docelowo byłaby logika z GitHub API lub prosty POST do backendu
    this._isLoggedIn.set(true);
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout() {
    this._isLoggedIn.set(false);
    localStorage.removeItem('isLoggedIn');
  }

  checkAuth(): boolean {
    const status = localStorage.getItem('isLoggedIn') === 'true';
    this._isLoggedIn.set(status);
    return status;
  }
}