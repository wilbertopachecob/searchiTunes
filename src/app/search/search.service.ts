import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ItunesDataService } from '../core/services/itunes-data.service';
import { SearchItem } from './search-item.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly itunesDataService = inject(ItunesDataService);

  /**
   * Executes a music search request for the provided term.
   */
  search(term: string): Observable<SearchItem[]> {
    return this.itunesDataService.search(term);
  }
}
