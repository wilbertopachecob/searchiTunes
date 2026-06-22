import { Provider } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';

import { registerAppIcons } from '@core/icons/icon.registry';

const enTranslations: Record<string, unknown> = {
  snackbar: {
    ok: 'OK',
    nice: 'Nice',
    addedToCart: '"{{title}}" added to cart',
    alreadyInCart: '"{{title}}" is already in your cart',
    removed: 'Removed "{{title}}"',
    selectItem: 'Select at least one item to continue',
    purchaseComplete: 'Purchase complete for USD {{total}}',
    cartCleared: 'Cart cleared',
  },
  cart: {
    emptyTitle: 'Nothing here yet',
    emptyDescription: 'Search for music and add songs or albums to your cart.',
    title: 'Your cart',
    totalSelected: 'Total (selected): USD {{total}}',
    song: 'Song',
    album: 'Album',
    remove: 'Remove',
    clearCart: 'Clear cart',
    buySelected: 'Buy selected',
  },
  table: {
    item: 'Item',
    details: 'Details',
    price: 'Price',
    action: 'Action',
    number: '#',
    artwork: 'Artwork',
    name: 'Name',
  },
  search: {
    addToCart: 'Add to Cart',
    loading: 'Searching iTunes...',
    placeholder: 'Search artists or songs...',
    title: 'Find music and add to cart',
    subtitle: 'Search tracks, preview snippets, and buy songs from one place.',
    added: 'Added',
  },
  artist: { songs: 'Songs', albums: 'Albums', loading: 'Loading artist...' },
  common: { loading: 'Loading...' },
};

function resolveTranslation(key: string, params?: Record<string, string>): string {
  const parts = key.split('.');
  let value: unknown = enTranslations;
  for (const part of parts) {
    value = (value as Record<string, unknown>)?.[part];
  }
  if (typeof value !== 'string') {
    return key;
  }
  return Object.entries(params ?? {}).reduce(
    (text, [param, replacement]) => text.replace(`{{${param}}}`, replacement),
    value,
  );
}

/** Provides icon and translation mocks for component unit tests. */
export function provideAppTesting(): Provider[] {
  return [
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const iconLibrary = new FaIconLibrary();
        registerAppIcons(iconLibrary);
        return iconLibrary;
      },
    },
    {
      provide: TranslateService,
      useValue: {
        instant: (key: string, params?: Record<string, string>) => resolveTranslation(key, params),
        translate: (key: string, params?: Record<string, string>) => () => resolveTranslation(key, params),
        use: () => undefined,
        get: () => undefined,
      },
    },
  ];
}