import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CartItem } from './cart-item.model';

@Injectable({ providedIn: 'root' })
export class ShoppingService {
  private readonly items: CartItem[] = [];
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);

  readonly items$ = this.itemsSubject.asObservable();

  /**
   * Returns a readonly snapshot of cart items.
   */
  getItems(): CartItem[] {
    return this.items.slice();
  }

  /**
   * Adds an item to the cart if it is not already present.
   *
   * @returns `true` when the item was inserted, `false` if it already existed.
   */
  addItem(item: CartItem): boolean {
    const exists = this.items.some((existing) => existing.id === item.id);

    if (!exists) {
      this.items.push(item);
      this.itemsSubject.next(this.getItems());
      return true;
    }

    return false;
  }

  /**
   * Removes a single item by id.
   */
  removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return;
    }

    this.items.splice(index, 1);
    this.itemsSubject.next(this.getItems());
  }

  /**
   * Clears all items from the cart.
   */
  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items.length = 0;
    this.itemsSubject.next([]);
  }

  /**
   * Checks whether a cart item already exists.
   */
  hasItem(itemId: string): boolean {
    return this.items.some((item) => item.id === itemId);
  }
}
