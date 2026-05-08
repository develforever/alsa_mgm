import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from './language.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule],
  template: `
    <button mat-button [matMenuTriggerFor]="langMenu" class="!flex items-center gap-1">
      <mat-icon>language</mat-icon>
      <span class="uppercase font-medium">{{ languageService.currentLanguage() }}</span>
    </button>
    <mat-menu #langMenu="matMenu">
      @for (lang of languageService.availableLanguages(); track lang.cod) {
        <button mat-menu-item 
                (click)="languageService.setLanguage(lang.cod)"
                [class.bg-blue-50]="lang.cod === languageService.currentLanguage()"
                [class.text-blue-600]="lang.cod === languageService.currentLanguage()">
          {{ lang.name }}
        </button>
      }
    </mat-menu>
  `
})
export class LanguageSelectorComponent {
  public languageService = inject(LanguageService);
}
