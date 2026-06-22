import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { Album, ItunesAlbumLookupResponse } from './album.model';
import { ShoppingService } from '../../shopping-cart/shopping.service';

@Component({
  selector: 'app-artist-albums',
  imports: [AsyncPipe],
  templateUrl: './artist-albums.component.html',
})
export class ArtistAlbumsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly shoppingService = inject(ShoppingService);

  albums$ = this.route.parent!.paramMap.pipe(
    switchMap((params) =>
      this.http.get<ItunesAlbumLookupResponse>(
        `https://itunes.apple.com/lookup?id=${params.get('artistId')}&entity=album&limit=10`,
      ),
    ),
    map((response) =>
      response.results
        .filter((item) => item.wrapperType !== 'artist')
        .map(
          (album): Album => ({
            collectionName: album.collectionName,
            collectionPrice: album.collectionPrice,
            artworkUrl60: album.artworkUrl60,
          }),
        ),
    ),
  );

  addToCart(album: Album): void {
    this.shoppingService.addItem(album);
  }
}
