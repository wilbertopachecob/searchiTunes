import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { ShoppingService } from '@cart/shopping.service';
import { SearchItem } from './search-item.model';
import { SearchComponent } from './search.component';
import { SearchService } from './search.service';

describe('SearchComponent', () => {
  const searchItem: SearchItem = {
    id: 'song-7',
    artistId: 42,
    artistName: 'Demo Artist',
    trackName: 'Demo Song',
    artworkUrl: 'https://example.com/demo.jpg',
    previewUrl: 'https://example.com/demo.m4a',
    trackPrice: 0.99,
    currency: 'USD',
  };

  let searchService: jest.Mocked<Pick<SearchService, 'search'>>;
  let shoppingService: jest.Mocked<Pick<ShoppingService, 'addItem' | 'hasItem'>>;
  let itunesDataService: jest.Mocked<Pick<ItunesDataService, 'toSearchCartItem'>>;
  let snackBar: jest.Mocked<Pick<MatSnackBar, 'open'>>;

  beforeEach(async () => {
    searchService = { search: jest.fn().mockReturnValue(of([])) };
    shoppingService = { addItem: jest.fn(), hasItem: jest.fn() };
    itunesDataService = {
      toSearchCartItem: jest.fn().mockReturnValue({
        id: searchItem.id,
        type: 'song',
        artistId: searchItem.artistId,
        artistName: searchItem.artistName,
        title: searchItem.trackName,
        artworkUrl: searchItem.artworkUrl,
        price: searchItem.trackPrice,
        currency: searchItem.currency,
        previewUrl: searchItem.previewUrl,
      }),
    };
    snackBar = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: ShoppingService, useValue: shoppingService },
        { provide: ItunesDataService, useValue: itunesDataService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({ term: '' })) } },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();
  });

  it('adds track to cart and shows success message', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;
    shoppingService.addItem.mockReturnValue(true);

    component.addToCart(searchItem);

    expect(itunesDataService.toSearchCartItem).toHaveBeenCalledWith(searchItem);
    expect(shoppingService.addItem).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('"Demo Song" added to cart', 'OK', {
      duration: 1800,
    });
  });

  it('reports when item already exists in cart', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;
    shoppingService.addItem.mockReturnValue(false);

    component.addToCart(searchItem);

    expect(snackBar.open).toHaveBeenCalledWith('"Demo Song" is already in your cart', 'OK', {
      duration: 1800,
    });
  });
});
