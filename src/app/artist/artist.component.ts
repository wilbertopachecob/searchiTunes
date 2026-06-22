import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { ItunesDataService } from '../core/services/itunes-data.service';

@Component({
  selector: 'app-artist',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './artist.component.html',
})
export class ArtistComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly itunesDataService = inject(ItunesDataService);

  artist$ = this.route.paramMap.pipe(
    map((params) => params.get('artistId') ?? ''),
    switchMap((artistId) => this.itunesDataService.getArtist(artistId)),
  );
}
