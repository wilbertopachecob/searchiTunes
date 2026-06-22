import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CartItem } from './cart-item.model';
import { ShoppingCartComponent } from './shopping-cart.component';
import { ShoppingService } from './shopping.service';

const songOne: CartItem = {
  id: 'song-1',
  type: 'song',
  artistId: 1,
  artistName: 'Artist A',
  title: 'Song One',
  artworkUrl: 'https://example.com/one.jpg',
  price: 1.29,
  currency: 'USD',
};

const songTwo: CartItem = {
  id: 'song-2',
  type: 'song',
  artistId: 1,
  artistName: 'Artist A',
  title: 'Song Two',
  artworkUrl: 'https://example.com/two.jpg',
  price: 0.99,
  currency: 'USD',
};

describe('ShoppingCartComponent', () => {
  let shoppingService: ShoppingService;
  let snackBar: jest.Mocked<Pick<MatSnackBar, 'open'>>;

  beforeEach(async () => {
    shoppingService = new ShoppingService();
    snackBar = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ShoppingCartComponent],
      providers: [
        { provide: ShoppingService, useValue: shoppingService },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();
  });

  function createComponent(): ShoppingCartComponent {
    const fixture = TestBed.createComponent(ShoppingCartComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('loads cart items and selects them by default', () => {
    shoppingService.addItem(songOne);
    shoppingService.addItem(songTwo);

    const component = createComponent();

    expect(component.shoppingItems).toEqual([songOne, songTwo]);
    expect(component.allSelected()).toBe(true);
    expect(component.total).toBe(2.28);
  });

  it('deselects an item and recalculates the total', () => {
    shoppingService.addItem(songOne);
    shoppingService.addItem(songTwo);
    const component = createComponent();

    component.toggleItem(songOne, false);

    expect(component.isSelected(songOne)).toBe(false);
    expect(component.isSelected(songTwo)).toBe(true);
    expect(component.total).toBe(0.99);
    expect(component.allSelected()).toBe(false);
  });

  it('re-selects a previously deselected item', () => {
    shoppingService.addItem(songOne);
    shoppingService.addItem(songTwo);
    const component = createComponent();

    component.toggleItem(songOne, false);
    component.toggleItem(songOne, true);

    expect(component.isSelected(songOne)).toBe(true);
    expect(component.isSelected(songTwo)).toBe(true);
    expect(component.total).toBe(2.28);
    expect(component.allSelected()).toBe(true);
  });

  it('selects or clears all rows', () => {
    shoppingService.addItem(songOne);
    shoppingService.addItem(songTwo);
    const component = createComponent();

    component.toggleAll(false);
    expect(component.total).toBe(0);

    component.toggleAll(true);
    expect(component.allSelected()).toBe(true);
    expect(component.total).toBe(2.28);
  });

  it('removes a single item and shows feedback', () => {
    shoppingService.addItem(songOne);
    const component = createComponent();

    component.remove(songOne);

    expect(shoppingService.getItems()).toEqual([]);
    expect(snackBar.open).toHaveBeenCalledWith('Removed "Song One"', 'OK', { duration: 1400 });
  });

  it('requires at least one selected item before checkout', () => {
    shoppingService.addItem(songOne);
    const component = createComponent();

    component.toggleAll(false);
    component.buy();

    expect(shoppingService.getItems()).toHaveLength(1);
    expect(snackBar.open).toHaveBeenCalledWith('Select at least one item to continue', 'OK', {
      duration: 1400,
    });
  });

  it('removes purchased items and shows a confirmation message', () => {
    shoppingService.addItem(songOne);
    shoppingService.addItem(songTwo);
    const component = createComponent();

    component.toggleItem(songTwo, false);
    component.buy();

    expect(shoppingService.getItems()).toEqual([songTwo]);
    expect(snackBar.open).toHaveBeenCalledWith('Purchase complete for USD 0.99', 'Nice', {
      duration: 2200,
    });
  });

  it('clears the cart and shows feedback', () => {
    shoppingService.addItem(songOne);
    const component = createComponent();

    component.clearCart();

    expect(shoppingService.getItems()).toEqual([]);
    expect(snackBar.open).toHaveBeenCalledWith('Cart cleared', 'OK', { duration: 1400 });
  });
});
