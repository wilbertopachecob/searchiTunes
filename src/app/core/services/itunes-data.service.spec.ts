import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ItunesDataService } from './itunes-data.service';

describe('ItunesDataService', () => {
  let service: ItunesDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItunesDataService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ItunesDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps iTunes search results to SearchItem view model', () => {
    service.search('Juan Luis Guerra').subscribe((items) => {
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({
        id: 'song-101',
        artistId: 900,
        artistName: 'Juan Luis Guerra',
        trackName: 'Bachata Rosa',
        artworkUrl: 'https://example.com/cover.jpg',
        previewUrl: 'https://example.com/preview.m4a',
        trackPrice: 1.29,
        currency: 'USD',
      });
    });

    const request = httpMock.expectOne((req) => req.url.includes('/search'));
    expect(request.request.method).toBe('GET');
    request.flush({
      results: [
        {
          trackId: 101,
          artistId: 900,
          artistName: 'Juan Luis Guerra',
          trackName: 'Bachata Rosa',
          artworkUrl100: 'https://example.com/cover.jpg',
          previewUrl: 'https://example.com/preview.m4a',
          trackPrice: 1.29,
          currency: 'USD',
        },
      ],
    });
  });
});
