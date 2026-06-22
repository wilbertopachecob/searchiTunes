import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppLanguage, LanguageService } from '@core/i18n/language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lang-switcher" role="group" aria-label="Language">
      @for (lang of languageService.languages; track lang) {
        <button
          type="button"
          class="lang-btn"
          [class.active]="languageService.currentLang() === lang"
          (click)="setLanguage(lang)"
        >
          {{ lang | uppercase }}
        </button>
      }
    </div>
  `,
})
export class LanguageSwitcherComponent {
  readonly languageService = inject(LanguageService);

  /** Switches the UI language. */
  setLanguage(lang: AppLanguage): void {
    this.languageService.setLanguage(lang);
  }
}
