import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { provideAppTesting } from '@core/i18n/translate-testing';
import { CartItem } from '@cart/cart-item.model';
import { ShoppingService } from '@cart/shopping.service';
import { ArtistSongsComponent } from './artist-songs.component';

describe('ArtistSongsComponent', () => {
  const song: CartItem = {
    id: 'song-1',
    type: 'song',
    artistId: 900,
    artistName: 'Juan Luis Guerra',
    title: 'Ojalá Que Llueva Café',
    artworkUrl: 'https://example.com/song.jpg',
    price: 0.99,
    currency: 'USD',
    previewUrl: 'https://example.com/preview.m4a',
  };

  let shoppingService: jest.Mocked<Pick<ShoppingService, 'addItem'>>;
  let snackBar: jest.Mocked<Pick<MatSnackBar, 'open'>>;

  beforeEach(async () => {
    shoppingService = { addItem: jest.fn() };
    snackBar = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ArtistSongsComponent],
      providers: [
        {
          provide: ItunesDataService,
          useValue: { getArtistSongs: jest.fn().mockReturnValue(of([song])) },
        },
        { provide: ShoppingService, useValue: shoppingService },
        { provide: MatSnackBar, useValue: snackBar },
        {
          provide: ActivatedRoute,
          useValue: { parent: { paramMap: of(convertToParamMap({ artistId: '900' })) } },
        },
        ...provideAppTesting(),
      ],
    }).compileComponents();
  });

  it('adds a song to the cart and shows success feedback', () => {
    const component = TestBed.createComponent(ArtistSongsComponent).componentInstance;
    shoppingService.addItem.mockReturnValue(true);

    component.addToCart(song);

    expect(shoppingService.addItem).toHaveBeenCalledWith(song);
    expect(snackBar.open).toHaveBeenCalledWith('"Ojalá Que Llueva Café" added to cart', 'OK', {
      duration: 1800,
    });
  });

  it('reports when the song is already in the cart', () => {
    const component = TestBed.createComponent(ArtistSongsComponent).componentInstance;
    shoppingService.addItem.mockReturnValue(false);

    component.addToCart(song);

    expect(snackBar.open).toHaveBeenCalledWith('"Ojalá Que Llueva Café" is already in your cart', 'OK', {
      duration: 1800,
    });
  });

  it('loads songs for the artist route param', (done) => {
    const component = TestBed.createComponent(ArtistSongsComponent).componentInstance;

    component.songs$.subscribe((songs) => {
      expect(songs).toEqual([song]);
      done();
    });
  });
});
