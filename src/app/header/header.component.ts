import { AsyncPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { ShoppingService } from '@cart/shopping.service';
import { LanguageSwitcherComponent } from '@app/shared/language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    FaIconComponent,
    TranslatePipe,
    LanguageSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly shoppingService = inject(ShoppingService);

  /**
   * Live cart count displayed in the header badge.
   */
  cartCount$ = this.shoppingService.items$.pipe(map((items) => items.length));
}
