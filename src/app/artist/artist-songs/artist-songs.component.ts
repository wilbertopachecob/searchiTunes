import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { ItunesSongLookupResponse, Song } from './song.model';
import { ShoppingService } from '../../shopping-cart/shopping.service';

@Component({
  selector: 'app-artist-songs',
  imports: [AsyncPipe],
  templateUrl: './artist-songs.component.html',
})
export class ArtistSongsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly shoppingService = inject(ShoppingService);

  songs$ = this.route.parent!.paramMap.pipe(
    switchMap((params) =>
      this.http.get<ItunesSongLookupResponse>(
        `https://itunes.apple.com/lookup?id=${params.get('artistId')}&entity=song&limit=10`,
      ),
    ),
    map((response) =>
      response.results
        .filter((item) => item.wrapperType !== 'artist')
        .map(
          (song): Song => ({
            trackName: song.trackName,
            previewUrl: song.previewUrl,
            artworkUrl60: song.artworkUrl60,
            trackPrice: song.trackPrice,
          }),
        ),
    ),
  );

  addToCart(song: Song): void {
    this.shoppingService.addItem(song);
  }
}
