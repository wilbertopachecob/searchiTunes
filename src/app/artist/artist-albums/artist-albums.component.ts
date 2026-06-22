import { AsyncPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize, map, switchMap, tap } from 'rxjs/operators';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { CartItem } from '@cart/cart-item.model';
import { ShoppingService } from '@cart/shopping.service';
import { LoadingStateComponent } from '@app/shared/loading-state/loading-state.component';

@Component({
  selector: 'app-artist-albums',
  imports: [AsyncPipe, FaIconComponent, TranslatePipe, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './artist-albums.component.html',
})
export class ArtistAlbumsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly itunesDataService = inject(ItunesDataService);
  private readonly shoppingService = inject(ShoppingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  loading = true;

  albums$ = this.route.parent!.paramMap.pipe(
    map((params) => params.get('artistId') ?? ''),
    tap(() => (this.loading = true)),
    switchMap((artistId) =>
      this.itunesDataService.getArtistAlbums(artistId).pipe(finalize(() => (this.loading = false))),
    ),
  );

  /**
   * Adds an album to the cart and shows lightweight feedback.
   */
  addToCart(album: CartItem): void {
    const inserted = this.shoppingService.addItem(album);
    const key = inserted ? 'snackbar.addedToCart' : 'snackbar.alreadyInCart';
    this.snackBar.open(
      this.translate.instant(key, { title: album.title }),
      this.translate.instant('snackbar.ok'),
      { duration: 1800 },
    );
  }
}
