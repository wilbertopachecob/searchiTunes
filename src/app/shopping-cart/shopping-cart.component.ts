import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { CartItem } from './cart-item.model';
import { ShoppingService } from './shopping.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [NgClass],
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent implements OnInit {
  private readonly shoppingService = inject(ShoppingService);

  shoppingItems: CartItem[] = [];
  total = 0;
  private selectedItems = new Set<CartItem>();

  ngOnInit(): void {
    this.shoppingItems = this.shoppingService.getItems();
    this.shoppingService.items$.subscribe((items) => {
      this.shoppingItems = items;
      this.selectedItems = new Set(items);
      this.recalculateTotal();
    });
  }

  itemPrice(item: CartItem): number {
    return item.trackPrice ?? item.collectionPrice ?? 0;
  }

  itemTitle(item: CartItem): string {
    return item.trackName ?? item.collectionName ?? 'Unknown';
  }

  isSong(item: CartItem): boolean {
    return Boolean(item.trackName);
  }

  isSelected(item: CartItem): boolean {
    return this.selectedItems.has(item);
  }

  toggleItem(item: CartItem, checked: boolean): void {
    if (checked) {
      this.selectedItems.add(item);
    } else {
      this.selectedItems.delete(item);
    }
    this.recalculateTotal();
  }

  toggleAll(checked: boolean): void {
    this.selectedItems = checked ? new Set(this.shoppingItems) : new Set();
    this.recalculateTotal();
  }

  allSelected(): boolean {
    return this.shoppingItems.length > 0 && this.selectedItems.size === this.shoppingItems.length;
  }

  buy(): void {
    const purchased = this.shoppingItems.filter((item) => this.selectedItems.has(item));
    console.log('Purchase simulation:', purchased, 'Total:', this.total);
    alert(`Demo purchase complete for $${this.total.toFixed(2)}`);
  }

  private recalculateTotal(): void {
    this.total = [...this.selectedItems].reduce((sum, item) => sum + this.itemPrice(item), 0);
    this.total = parseFloat(this.total.toFixed(2));
  }
}
