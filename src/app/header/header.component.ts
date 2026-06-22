import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { AppLanguage, LanguageService } from '@core/i18n/language.service';
import { ShoppingService } from '@cart/shopping.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, UpperCasePipe, FaIconComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly shoppingService = inject(ShoppingService);
  readonly languageService = inject(LanguageService);

  /**
   * Live cart count displayed in the header badge.
   */
  cartCount$ = this.shoppingService.items$.pipe(map((items) => items.length));

  /** Switches the UI language. */
  setLanguage(lang: AppLanguage): void {
    this.languageService.setLanguage(lang);
  }
}
