import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CartItem } from './cart-item.model';

@Injectable({ providedIn: 'root' })
export class ShoppingService {
  private readonly items: CartItem[] = [];
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);

  readonly items$ = this.itemsSubject.asObservable();

  getItems(): CartItem[] {
    return this.items.slice();
  }

  addItem(item: CartItem): void {
    const exists = this.items.some(
      (existing) =>
        (item.trackName && existing.trackName === item.trackName) ||
        (item.collectionName && existing.collectionName === item.collectionName),
    );

    if (!exists) {
      this.items.push(item);
      this.itemsSubject.next(this.getItems());
    }
  }
}
