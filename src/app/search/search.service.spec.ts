import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { SearchService } from './search.service';
import { SearchItem } from './search-item.model';

describe('SearchService', () => {
  let service: SearchService;
  let itunesDataService: jest.Mocked<Pick<ItunesDataService, 'search'>>;

  beforeEach(() => {
    itunesDataService = {
      search: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [SearchService, { provide: ItunesDataService, useValue: itunesDataService }],
    });

    service = TestBed.inject(SearchService);
  });

  it('delegates search calls to ItunesDataService', (done) => {
    const expected: SearchItem[] = [
      {
        id: 'song-10',
        artistId: 2,
        artistName: 'Juan Luis Guerra',
        trackName: 'Bachata Rosa',
        artworkUrl: 'https://example.com/cover.jpg',
        previewUrl: 'https://example.com/audio.m4a',
        trackPrice: 1.29,
        currency: 'USD',
      },
    ];
    itunesDataService.search.mockReturnValue(of(expected));

    service.search('bachata').subscribe((items) => {
      expect(items).toEqual(expected);
      expect(itunesDataService.search).toHaveBeenCalledWith('bachata');
      done();
    });
  });
});
