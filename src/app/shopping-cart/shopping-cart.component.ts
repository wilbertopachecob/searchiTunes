import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CartItem } from './cart-item.model';
import { ShoppingService } from './shopping.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [NgClass],
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent implements OnInit {
  private readonly shoppingService = inject(ShoppingService);
  private readonly snackBar = inject(MatSnackBar);

  shoppingItems: CartItem[] = [];
  total = 0;
  private selectedItems = new Set<string>();

  ngOnInit(): void {
    this.shoppingService.items$.subscribe((items) => {
      this.shoppingItems = items;
      this.selectedItems = new Set(items.map((item) => item.id));
      this.recalculateTotal();
    });
  }

  /**
   * Tracks whether an item is currently selected.
   */
  isSelected(item: CartItem): boolean {
    return this.selectedItems.has(item.id);
  }

  /**
   * Toggles a single row selection.
   */
  toggleItem(item: CartItem, checked: boolean): void {
    if (checked) {
      this.selectedItems.add(item.id);
    } else {
      this.selectedItems.delete(item.id);
    }
    this.recalculateTotal();
  }

  /**
   * Selects or unselects all rows.
   */
  toggleAll(checked: boolean): void {
    this.selectedItems = checked ? new Set(this.shoppingItems.map((item) => item.id)) : new Set();
    this.recalculateTotal();
  }

  allSelected(): boolean {
    return this.shoppingItems.length > 0 && this.selectedItems.size === this.shoppingItems.length;
  }

  /**
   * Removes one item from the cart.
   */
  remove(item: CartItem): void {
    this.shoppingService.removeItem(item.id);
    this.snackBar.open(`Removed "${item.title}"`, 'OK', { duration: 1400 });
  }

  /**
   * Simulates checkout and removes purchased rows.
   */
  buy(): void {
    const selectedIds = [...this.selectedItems];
    if (selectedIds.length === 0) {
      this.snackBar.open('Select at least one item to continue', 'OK', { duration: 1400 });
      return;
    }

    selectedIds.forEach((id) => this.shoppingService.removeItem(id));
    this.snackBar.open(`Purchase complete for USD ${this.total.toFixed(2)}`, 'Nice', { duration: 2200 });
  }

  /**
   * Empties the cart.
   */
  clearCart(): void {
    this.shoppingService.clear();
    this.snackBar.open('Cart cleared', 'OK', { duration: 1400 });
  }

  private recalculateTotal(): void {
    this.total = this.shoppingItems
      .filter((item) => this.selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.price, 0);
    this.total = parseFloat(this.total.toFixed(2));
  }
}
