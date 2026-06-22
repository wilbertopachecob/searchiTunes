import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { ItunesDataService } from '@core/services/itunes-data.service';
import { ShoppingService } from '@cart/shopping.service';
import { SearchItem } from './search-item.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shoppingService = inject(ShoppingService);
  private readonly itunesDataService = inject(ItunesDataService);
  private readonly snackBar = inject(MatSnackBar);
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
        return this.searchService.search(term).pipe(tap(() => (this.loading = false)));
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
    this.snackBar.open(
      inserted ? `"${item.trackName}" added to cart` : `"${item.trackName}" is already in your cart`,
      'OK',
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
