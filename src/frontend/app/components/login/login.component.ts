// frontend/src/app/components/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>Panel Zarządzania Transmar</h2>
      <p>Zaloguj się, aby uzyskać dostęp do zarządzania liniami</p>
      <button (click)="onLogin()" style="padding: 10px 20px; cursor: pointer;">
        Zaloguj przez GitHub (Symulacja)
      </button>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.authService.login();
    this.router.navigate(['/allocations']);
  }
}