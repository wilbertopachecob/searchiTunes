import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SearchItem } from '@search/search-item.model';
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

  describe('search', () => {
    it('returns an empty array for blank terms without calling the API', () => {
      let emitted = false;
      service.search('   ').subscribe((items) => {
        emitted = true;
        expect(items).toEqual([]);
      });
      expect(emitted).toBe(true);
      httpMock.expectNone((req) => req.url.includes('/search'));
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
      expect(request.request.params.get('term')).toBe('Juan Luis Guerra');
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

    it('filters incomplete results and applies fallback values', () => {
      service.search('demo').subscribe((items) => {
        expect(items).toHaveLength(1);
        expect(items[0]).toEqual({
          id: 'song-2',
          artistId: 5,
          artistName: 'Unknown artist',
          trackName: 'Fallback Song',
          artworkUrl: 'https://example.com/60.jpg',
          previewUrl: '',
          trackPrice: 0,
          currency: 'USD',
        });
      });

      const request = httpMock.expectOne((req) => req.url.includes('/search'));
      request.flush({
        results: [
          { trackName: 'Missing ids' },
          {
            trackId: 2,
            artistId: 5,
            trackName: 'Fallback Song',
            artworkUrl60: 'https://example.com/60.jpg',
          },
        ],
      });
    });
  });

  describe('getArtist', () => {
    it('maps the first lookup result to an Artist', () => {
      service.getArtist('900').subscribe((artist) => {
        expect(artist).toEqual({
          artistName: 'Juan Luis Guerra',
          primaryGenreName: 'Latin',
        });
      });

      const request = httpMock.expectOne((req) => req.url.includes('/lookup'));
      expect(request.request.params.get('id')).toBe('900');
      request.flush({
        results: [{ artistName: 'Juan Luis Guerra', primaryGenreName: 'Latin' }],
      });
    });

    it('returns defaults when lookup has no results', () => {
      service.getArtist('missing').subscribe((artist) => {
        expect(artist).toEqual({
          artistName: 'Unknown artist',
          primaryGenreName: '',
        });
      });

      const request = httpMock.expectOne((req) => req.url.includes('/lookup'));
      request.flush({ results: [] });
    });
  });

  describe('getArtistSongs', () => {
    it('maps song lookup results to cart items', () => {
      service.getArtistSongs('900').subscribe((songs) => {
        expect(songs).toHaveLength(1);
        expect(songs[0]).toEqual({
          id: 'song-55',
          type: 'song',
          artistId: 900,
          artistName: 'Juan Luis Guerra',
          title: 'Ojalá Que Llueva Café',
          artworkUrl: 'https://example.com/song.jpg',
          price: 0.99,
          currency: 'USD',
          previewUrl: 'https://example.com/preview.m4a',
        });
      });

      const request = httpMock.expectOne((req) => req.url.includes('/lookup'));
      expect(request.request.params.get('entity')).toBe('song');
      request.flush({
        results: [
          { wrapperType: 'artist', artistId: 900 },
          {
            trackId: 55,
            artistId: 900,
            artistName: 'Juan Luis Guerra',
            trackName: 'Ojalá Que Llueva Café',
            artworkUrl100: 'https://example.com/song.jpg',
            trackPrice: 0.99,
            currency: 'USD',
            previewUrl: 'https://example.com/preview.m4a',
          },
        ],
      });
    });
  });

  describe('getArtistAlbums', () => {
    it('maps album lookup results to cart items', () => {
      service.getArtistAlbums('900').subscribe((albums) => {
        expect(albums).toHaveLength(1);
        expect(albums[0]).toEqual({
          id: 'album-77',
          type: 'album',
          artistId: 900,
          artistName: 'Juan Luis Guerra',
          title: 'Bachata Rosa',
          artworkUrl: 'https://example.com/album.jpg',
          price: 9.99,
          currency: 'USD',
        });
      });

      const request = httpMock.expectOne((req) => req.url.includes('/lookup'));
      expect(request.request.params.get('entity')).toBe('album');
      request.flush({
        results: [
          { wrapperType: 'artist', artistId: 900 },
          {
            collectionId: 77,
            artistId: 900,
            artistName: 'Juan Luis Guerra',
            collectionName: 'Bachata Rosa',
            artworkUrl100: 'https://example.com/album.jpg',
            collectionPrice: 9.99,
            currency: 'USD',
          },
        ],
      });
    });
  });

  describe('toSearchCartItem', () => {
    it('converts a search item into a cart item', () => {
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

      expect(service.toSearchCartItem(searchItem)).toEqual({
        id: 'song-7',
        type: 'song',
        artistId: 42,
        artistName: 'Demo Artist',
        title: 'Demo Song',
        artworkUrl: 'https://example.com/demo.jpg',
        price: 0.99,
        currency: 'USD',
        previewUrl: 'https://example.com/demo.m4a',
      });
    });
  });
});
