import { Component, inject, isDevMode, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-login',
  imports: [CommonModule, TranslocoModule],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>{{ 'AUTH.LOGIN_TITLE' | transloco }}</h2>
      <p>{{ 'AUTH.LOGIN_SUBTITLE' | transloco }}</p>
      <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        <button (click)="onLogin()" style="padding: 10px 20px; cursor: pointer; width: 200px;">
          {{ 'AUTH.LOGIN_GITHUB' | transloco }}
        </button>
        @if (devMode) {
          <button (click)="onDevLogin()" 
                  style="padding: 10px 20px; cursor: pointer; width: 200px; background-color: #ffd700; border: 1px solid #ccac00;">
            {{ 'AUTH.LOGIN_DEV_MOCK' | transloco }}
          </button>
        }
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  devMode = isDevMode();

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.authService.loginWithGithub();
  }

  onDevLogin() {
    this.authService.loginDev();
  }
}