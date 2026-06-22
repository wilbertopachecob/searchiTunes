import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ItunesSearchResponse, SearchItem } from './search-item.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly url = 'https://itunes.apple.com/search';

  constructor(private http: HttpClient) {}

  search(term: string): Observable<SearchItem[]> {
    const trimmed = term.trim();
    if (!trimmed) {
      return of([]);
    }

    return this.http
      .get<ItunesSearchResponse>(this.url, {
        params: { term: trimmed, media: 'music', limit: '10' },
      })
      .pipe(
        map((response) =>
          response.results.map(
            (item) =>
              ({
                trackName: item.trackName,
                artworkUrl60: item.artworkUrl60,
                previewUrl: item.previewUrl,
                artistId: item.artistId,
              }) satisfies SearchItem,
          ),
        ),
      );
  }
}
