export type CartItemType = 'song' | 'album';

/**
 * Canonical purchasable item used across search, artist, and cart views.
 */
export interface CartItem {
  id: string;
  type: CartItemType;
  artistId: number;
  artistName: string;
  title: string;
  artworkUrl: string;
  price: number;
  currency: string;
  previewUrl?: string;
}
