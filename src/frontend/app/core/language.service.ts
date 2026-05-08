import { Injectable, signal, effect, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translocoService = inject(TranslocoService);
  
  // Use signals for reactive programming paradigm as specified in global rules
  readonly availableLanguages = signal<{cod: string, name: string}[]>([
    { cod: 'pl', name: 'Polski' },
    { cod: 'en', name: 'English' }
  ]);
  readonly currentLanguage = signal<string>(this.getInitialLanguage());

  constructor() {
    // Whenever currentLanguage signal changes, update transloco and local storage
    effect(() => {
      const lang = this.currentLanguage();
      this.translocoService.setActiveLang(lang);
      localStorage.setItem('app-language', lang);
    });
  }

  setLanguage(langCod: string): void {
    const isAvailable = this.availableLanguages().some(l => l.cod === langCod);
    if (isAvailable) {
      this.currentLanguage.set(langCod);
    }
  }

  private getInitialLanguage(): string {
    const saved = localStorage.getItem('app-language');
    if (saved && this.availableLanguages().some(l => l.cod === saved)) {
      return saved;
    }
    return 'pl';
  }
}
