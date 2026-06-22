import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap } from 'rxjs/operators';

import { ItunesDataService } from '../../core/services/itunes-data.service';
import { CartItem } from '../../shopping-cart/cart-item.model';
import { ShoppingService } from '../../shopping-cart/shopping.service';

@Component({
  selector: 'app-artist-songs',
  imports: [AsyncPipe],
  templateUrl: './artist-songs.component.html',
})
export class ArtistSongsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly itunesDataService = inject(ItunesDataService);
  private readonly shoppingService = inject(ShoppingService);
  private readonly snackBar = inject(MatSnackBar);

  songs$ = this.route.parent!.paramMap.pipe(
    map((params) => params.get('artistId') ?? ''),
    switchMap((artistId) => this.itunesDataService.getArtistSongs(artistId)),
  );

  /**
   * Adds a song to the cart and shows lightweight feedback.
   */
  addToCart(song: CartItem): void {
    const inserted = this.shoppingService.addItem(song);
    this.snackBar.open(
      inserted ? `"${song.title}" added to cart` : `"${song.title}" is already in your cart`,
      'OK',
      { duration: 1800 },
    );
  }
}
