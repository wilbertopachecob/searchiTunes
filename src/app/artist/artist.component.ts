import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { Artist, ItunesLookupResponse } from './artist.model';

@Component({
  selector: 'app-artist',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './artist.component.html',
})
export class ArtistComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  artist$ = this.route.paramMap.pipe(
    switchMap((params) =>
      this.http.get<ItunesLookupResponse>(
        `https://itunes.apple.com/lookup?id=${params.get('artistId')}`,
      ),
    ),
    map((data): Artist => {
      const result = data.results[0];
      return {
        artistName: result?.artistName ?? 'Unknown artist',
        primaryGenreName: result?.primaryGenreName ?? '',
      };
    }),
  );
}
