import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { ShoppingService } from '@cart/shopping.service';
import { LoadingStateComponent } from '@app/shared/loading-state/loading-state.component';
import { SearchItem } from './search-item.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    FaIconComponent,
    TranslatePipe,
    LoadingStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shoppingService = inject(ShoppingService);
  private readonly itunesDataService = inject(ItunesDataService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  @ViewChildren('audio') audios!: QueryList<ElementRef<HTMLAudioElement>>;

  loading = false;
  searchItems$!: Observable<SearchItem[]>;
  form = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.searchItems$ = this.route.queryParamMap.pipe(
      map((params) => params.get('term') ?? ''),
      tap((term) => this.form.controls.search.setValue(term, { emitEvent: false })),
      switchMap((term) => {
        this.loading = true;
        return this.searchService.search(term).pipe(finalize(() => (this.loading = false)));
      }),
      startWith([]),
    );

    this.form.controls.search.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { term: term.trim() || null },
          queryParamsHandling: 'merge',
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Adds a search result item to the cart.
   */
  addToCart(item: SearchItem): void {
    const inserted = this.shoppingService.addItem(this.itunesDataService.toSearchCartItem(item));
    const key = inserted ? 'snackbar.addedToCart' : 'snackbar.alreadyInCart';
    this.snackBar.open(
      this.translate.instant(key, { title: item.trackName }),
      this.translate.instant('snackbar.ok'),
      { duration: 1800 },
    );
  }

  /**
   * Checks if the item has already been inserted.
   */
  isInCart(item: SearchItem): boolean {
    return this.shoppingService.hasItem(item.id);
  }

  /**
   * Pauses all previews except the active one.
   */
  stopAll(audio: HTMLAudioElement): void {
    this.audios.forEach((element) => {
      if (audio !== element.nativeElement) {
        element.nativeElement.pause();
      }
    });
  }
}
