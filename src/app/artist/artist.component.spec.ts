import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { ArtistComponent } from './artist.component';

describe('ArtistComponent', () => {
  it('loads artist details from route params', (done) => {
    const artist = { artistName: 'Juan Luis Guerra', primaryGenreName: 'Latin' };

    TestBed.configureTestingModule({
      imports: [ArtistComponent],
      providers: [
        {
          provide: ItunesDataService,
          useValue: { getArtist: jest.fn().mockReturnValue(of(artist)) },
        },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ artistId: '900' })) },
        },
      ],
    });

    const component = TestBed.createComponent(ArtistComponent).componentInstance;

    component.artist$.subscribe((result) => {
      expect(result).toEqual(artist);
      done();
    });
  });
});
