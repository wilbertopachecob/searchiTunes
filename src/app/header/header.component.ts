import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs/operators';

import { ShoppingService } from '../shopping-cart/shopping.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly shoppingService = inject(ShoppingService);

  /**
   * Live cart count displayed in the header badge.
   */
  cartCount$ = this.shoppingService.items$.pipe(map((items) => items.length));
}
