import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'es';

const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly languages: AppLanguage[] = ['en', 'es'];
  readonly currentLang = signal<AppLanguage>('en');

  /** Restores the saved language or falls back to English. */
  init(): void {
    const saved = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    const lang = saved && this.languages.includes(saved) ? saved : 'en';
    this.setLanguage(lang);
  }

  /** Switches the active language and persists the preference. */
  setLanguage(lang: AppLanguage): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }
}
