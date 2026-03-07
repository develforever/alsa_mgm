
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'home-login-component',
  imports: [CommonModule],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>Logowanie</h2>
      <p>Zaloguj się, aby uzyskać dostęp do panelu</p>
      <button (click)="onLogin()" style="padding: 10px 20px; cursor: pointer;">
        Zaloguj z GitHub
      </button>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.authService.loginWithGithub();
  }
}