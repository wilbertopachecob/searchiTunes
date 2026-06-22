import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap } from 'rxjs/operators';

import { ItunesDataService } from '../../core/services/itunes-data.service';
import { CartItem } from '../../shopping-cart/cart-item.model';
import { ShoppingService } from '../../shopping-cart/shopping.service';

@Component({
  selector: 'app-artist-albums',
  imports: [AsyncPipe],
  templateUrl: './artist-albums.component.html',
})
export class ArtistAlbumsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly itunesDataService = inject(ItunesDataService);
  private readonly shoppingService = inject(ShoppingService);
  private readonly snackBar = inject(MatSnackBar);

  albums$ = this.route.parent!.paramMap.pipe(
    map((params) => params.get('artistId') ?? ''),
    switchMap((artistId) => this.itunesDataService.getArtistAlbums(artistId)),
  );

  /**
   * Adds an album to the cart and shows lightweight feedback.
   */
  addToCart(album: CartItem): void {
    const inserted = this.shoppingService.addItem(album);
    this.snackBar.open(
      inserted ? `"${album.title}" added to cart` : `"${album.title}" is already in your cart`,
      'OK',
      { duration: 1800 },
    );
  }
}
