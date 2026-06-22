import { AsyncPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, map, switchMap, tap } from 'rxjs/operators';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { LoadingStateComponent } from '@app/shared/loading-state/loading-state.component';

@Component({
  selector: 'app-artist',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, TranslatePipe, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './artist.component.html',
})
export class ArtistComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly itunesDataService = inject(ItunesDataService);

  loading = true;

  artist$ = this.route.paramMap.pipe(
    map((params) => params.get('artistId') ?? ''),
    tap(() => (this.loading = true)),
    switchMap((artistId) =>
      this.itunesDataService.getArtist(artistId).pipe(finalize(() => (this.loading = false))),
    ),
  );
}
