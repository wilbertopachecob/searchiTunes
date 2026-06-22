import { AsyncPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { SearchItem } from './search-item.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  private readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChildren('audio') audios!: QueryList<{ nativeElement: HTMLAudioElement }>;

  loading = false;
  searchItems$!: Observable<SearchItem[]>;
  form = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.searchItems$ = this.route.paramMap.pipe(
      map((params) => params.get('term') ?? ''),
      tap((term) => this.form.controls.search.setValue(term, { emitEvent: false })),
      switchMap((term) => {
        this.loading = true;
        return this.searchService.search(term).pipe(tap(() => (this.loading = false)));
      }),
      startWith([]),
    );

    this.form.controls.search.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.router.navigate(['search', { term }]);
      });
  }

  stopAll(audio: HTMLAudioElement): void {
    this.audios.forEach((element) => {
      if (audio !== element.nativeElement) {
        element.nativeElement.pause();
      }
    });
  }
}
