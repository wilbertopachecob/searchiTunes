import { ShoppingService } from './shopping.service';
import { CartItem } from './cart-item.model';

const demoSong: CartItem = {
  id: 'song-1',
  type: 'song',
  artistId: 1,
  artistName: 'Demo Artist',
  title: 'Demo Song',
  artworkUrl: 'https://example.com/art.jpg',
  price: 1.29,
  currency: 'USD',
  previewUrl: 'https://example.com/preview.m4a',
};

describe('ShoppingService', () => {
  let service: ShoppingService;

  beforeEach(() => {
    service = new ShoppingService();
  });

  it('adds a new item once and prevents duplicates', () => {
    expect(service.addItem(demoSong)).toBe(true);
    expect(service.addItem(demoSong)).toBe(false);
    expect(service.getItems()).toHaveLength(1);
  });

  it('removes a single item by id', () => {
    service.addItem(demoSong);
    service.removeItem(demoSong.id);

    expect(service.getItems()).toHaveLength(0);
  });

  it('clears the full cart', () => {
    service.addItem(demoSong);
    service.addItem({ ...demoSong, id: 'song-2', title: 'Another Song' });

    service.clear();

    expect(service.getItems()).toEqual([]);
  });
});
