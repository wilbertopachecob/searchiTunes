import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Searchitems } from './searchitem.model';
import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {

  url: string;
  searchItems: Searchitems[];

  constructor(private http: HttpClient) {
    this.url = 'https://itunes.apple.com/search';
  }

  search(term: string): Observable<Searchitems[]> {
    return this.http.get(`${this.url}?term=${term}&media=music&limit=10`)
      .debounceTime(400)
      .distinctUntilChanged()
      .map(res => {
        return res['results'].map(item => {
          return new Searchitems(
            item.trackName,
            item.artworkUrl60,
            item.previewUrl,
            item.artistId
          )
          // console.log(res);
          // return true;
        })
      })
  }

}
