import { AsyncPipe, NgClass } from '@angular/common';
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

  cartCount$ = this.shoppingService.items$.pipe(map((items) => items.length));
}
