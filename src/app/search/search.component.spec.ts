import { ElementRef, QueryList } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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
  let router: jest.Mocked<Pick<Router, 'navigate'>>;

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
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: ShoppingService, useValue: shoppingService },
        { provide: ItunesDataService, useValue: itunesDataService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({ term: '' })) } },
        { provide: Router, useValue: router },
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

  it('delegates cart membership checks to ShoppingService', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;
    shoppingService.hasItem.mockReturnValue(true);

    expect(component.isInCart(searchItem)).toBe(true);
    expect(shoppingService.hasItem).toHaveBeenCalledWith(searchItem.id);
  });

  it('pauses every preview except the active audio element', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;

    const activeAudio = { pause: jest.fn() } as unknown as HTMLAudioElement;
    const otherAudio = { pause: jest.fn() } as unknown as HTMLAudioElement;
    component.audios = new QueryList<ElementRef<HTMLAudioElement>>();
    component.audios.reset([
      new ElementRef(activeAudio),
      new ElementRef(otherAudio),
    ]);

    component.stopAll(activeAudio);

    expect(otherAudio.pause).toHaveBeenCalled();
    expect(activeAudio.pause).not.toHaveBeenCalled();
  });

  it('syncs the search term from route params on init', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.form.controls.search.value).toBe('');
    expect(searchService.search).toHaveBeenCalledWith('');
  });

  it('navigates with the debounced search term', fakeAsync(() => {
    const fixture = TestBed.createComponent(SearchComponent);
    fixture.detectChanges();

    fixture.componentInstance.form.controls.search.setValue('bachata');
    tick(400);

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { term: 'bachata' },
      queryParamsHandling: 'merge',
    });
  }));

  it('stops listening to form changes after destroy', fakeAsync(() => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnDestroy();
    component.form.controls.search.setValue('bachata');
    tick(400);

    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
