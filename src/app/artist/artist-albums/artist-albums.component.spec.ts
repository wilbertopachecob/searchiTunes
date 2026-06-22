import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { CartItem } from '@cart/cart-item.model';
import { ShoppingService } from '@cart/shopping.service';
import { ArtistAlbumsComponent } from './artist-albums.component';

describe('ArtistAlbumsComponent', () => {
  const album: CartItem = {
    id: 'album-1',
    type: 'album',
    artistId: 900,
    artistName: 'Juan Luis Guerra',
    title: 'Bachata Rosa',
    artworkUrl: 'https://example.com/album.jpg',
    price: 9.99,
    currency: 'USD',
  };

  let shoppingService: jest.Mocked<Pick<ShoppingService, 'addItem'>>;
  let snackBar: jest.Mocked<Pick<MatSnackBar, 'open'>>;

  beforeEach(async () => {
    shoppingService = { addItem: jest.fn() };
    snackBar = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ArtistAlbumsComponent],
      providers: [
        {
          provide: ItunesDataService,
          useValue: { getArtistAlbums: jest.fn().mockReturnValue(of([album])) },
        },
        { provide: ShoppingService, useValue: shoppingService },
        { provide: MatSnackBar, useValue: snackBar },
        {
          provide: ActivatedRoute,
          useValue: { parent: { paramMap: of(convertToParamMap({ artistId: '900' })) } },
        },
      ],
    }).compileComponents();
  });

  it('adds an album to the cart and shows success feedback', () => {
    const component = TestBed.createComponent(ArtistAlbumsComponent).componentInstance;
    shoppingService.addItem.mockReturnValue(true);

    component.addToCart(album);

    expect(shoppingService.addItem).toHaveBeenCalledWith(album);
    expect(snackBar.open).toHaveBeenCalledWith('"Bachata Rosa" added to cart', 'OK', {
      duration: 1800,
    });
  });

  it('reports when the album is already in the cart', () => {
    const component = TestBed.createComponent(ArtistAlbumsComponent).componentInstance;
    shoppingService.addItem.mockReturnValue(false);

    component.addToCart(album);

    expect(snackBar.open).toHaveBeenCalledWith('"Bachata Rosa" is already in your cart', 'OK', {
      duration: 1800,
    });
  });

  it('loads albums for the artist route param', (done) => {
    const component = TestBed.createComponent(ArtistAlbumsComponent).componentInstance;

    component.albums$.subscribe((albums) => {
      expect(albums).toEqual([album]);
      done();
    });
  });
});
