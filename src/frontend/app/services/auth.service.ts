
import { Injectable, inject, computed, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../../../shared/models/types';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Zmieniamy na stabilny resource API (Signals-first)
  private authResource = resource({
    loader: () => lastValueFrom(this.http.get<{ isAuthenticated: boolean; user?: User }>('/api/auth/status'))
  });

  // Signal-e pochodne (computed) - automatycznie synchronizowane z zasobem
  isLoggedIn = computed(() => this.authResource.value()?.isAuthenticated ?? false);
  user = computed(() => this.authResource.value()?.user);

  getUser() {
    return this.user();
  }

  /**
   * Manualny refresh statusu (jeśli potrzebny), np. po akcjach zewnętrznych.
   * W nowym modelu rxResource zazwyczaj nie jest potrzebny manualny checkAuth.
   */
  checkAuth() {
    this.authResource.reload();
  }

  loginWithGithub() {
    window.location.href = `/api/auth/github`;
  }

  loginDev() {
    window.location.href = `/api/auth/dev-login`;
  }

  logout() {
    // Używamy prostego wezwania API, a stan zaktualizuje się po przekierowaniu
    // lub przez manualny reload zasobu jeśli byśmy zostawali na tej samej stronie
    this.http.get('/api/auth/logout').subscribe({
      next: () => {
        window.location.href = '/login';
      },
      error: (err) => console.error('Logout failed', err)
    });
  }
}