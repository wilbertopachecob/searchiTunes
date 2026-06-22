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

  it('emits cart updates through items$', (done) => {
    const emissions: CartItem[][] = [];
    const subscription = service.items$.subscribe((items) => emissions.push(items));

    service.addItem(demoSong);
    service.removeItem(demoSong.id);

    subscription.unsubscribe();
    expect(emissions).toEqual([[], [demoSong], []]);
    done();
  });

  it('removes a single item by id', () => {
    service.addItem(demoSong);
    service.removeItem(demoSong.id);

    expect(service.getItems()).toHaveLength(0);
  });

  it('ignores remove requests for unknown ids', () => {
    service.addItem(demoSong);
    service.removeItem('missing-id');

    expect(service.getItems()).toHaveLength(1);
  });

  it('clears the full cart', () => {
    service.addItem(demoSong);
    service.addItem({ ...demoSong, id: 'song-2', title: 'Another Song' });

    service.clear();

    expect(service.getItems()).toEqual([]);
  });

  it('does nothing when clearing an already empty cart', () => {
    const next = jest.fn();
    const subscription = service.items$.subscribe(next);

    service.clear();

    expect(service.getItems()).toEqual([]);
    expect(next).toHaveBeenCalledTimes(1);
    subscription.unsubscribe();
  });

  it('reports whether an item exists in the cart', () => {
    expect(service.hasItem(demoSong.id)).toBe(false);

    service.addItem(demoSong);

    expect(service.hasItem(demoSong.id)).toBe(true);
    expect(service.hasItem('song-2')).toBe(false);
  });
});
