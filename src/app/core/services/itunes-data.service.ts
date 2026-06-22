import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Artist, ItunesLookupResponse } from '@artist/artist.model';
import { SearchItem } from '@search/search-item.model';
import { CartItem } from '@cart/cart-item.model';

interface ItunesMusicLookupResponse {
  results: Array<{
    wrapperType?: string;
    trackId?: number;
    collectionId?: number;
    artistId?: number;
    artistName?: string;
    trackName?: string;
    collectionName?: string;
    previewUrl?: string;
    artworkUrl100?: string;
    artworkUrl60?: string;
    trackPrice?: number;
    collectionPrice?: number;
    currency?: string;
  }>;
}

/**
 * Centralized iTunes API access and response mapping.
 */
@Injectable({ providedIn: 'root' })
export class ItunesDataService {
  private readonly http = inject(HttpClient);
  private readonly searchUrl = 'https://itunes.apple.com/search';
  private readonly lookupUrl = 'https://itunes.apple.com/lookup';

  /**
   * Searches iTunes music by term and maps results to UI-ready search items.
   */
  search(term: string): Observable<SearchItem[]> {
    const normalizedTerm = term.trim();
    if (!normalizedTerm) {
      return of([]);
    }

    return this.http
      .get<ItunesMusicLookupResponse>(this.searchUrl, {
        params: new HttpParams()
          .set('term', normalizedTerm)
          .set('media', 'music')
          .set('entity', 'song')
          .set('limit', '20'),
      })
      .pipe(
        map((response) =>
          response.results
            .filter((item) => Boolean(item.trackId && item.trackName && item.artistId))
            .map((item) => ({
              id: `song-${item.trackId}`,
              artistId: item.artistId!,
              artistName: item.artistName ?? 'Unknown artist',
              trackName: item.trackName!,
              artworkUrl: item.artworkUrl100 ?? item.artworkUrl60 ?? '',
              previewUrl: item.previewUrl ?? '',
              trackPrice: item.trackPrice ?? 0,
              currency: item.currency ?? 'USD',
            })),
        ),
      );
  }

  /**
   * Looks up artist details by id.
   */
  getArtist(artistId: string): Observable<Artist> {
    return this.http
      .get<ItunesLookupResponse>(this.lookupUrl, {
        params: new HttpParams().set('id', artistId),
      })
      .pipe(
        map((response) => {
          const artist = response.results[0];
          return {
            artistName: artist?.artistName ?? 'Unknown artist',
            primaryGenreName: artist?.primaryGenreName ?? '',
          };
        }),
      );
  }

  /**
   * Returns purchasable songs for a given artist.
   */
  getArtistSongs(artistId: string): Observable<CartItem[]> {
    return this.http
      .get<ItunesMusicLookupResponse>(this.lookupUrl, {
        params: new HttpParams().set('id', artistId).set('entity', 'song').set('limit', '20'),
      })
      .pipe(
        map((response) =>
          response.results
            .filter((item) => item.wrapperType !== 'artist' && Boolean(item.trackId && item.trackName))
            .map((item) => this.toSongCartItem(item)),
        ),
      );
  }

  /**
   * Returns purchasable albums for a given artist.
   */
  getArtistAlbums(artistId: string): Observable<CartItem[]> {
    return this.http
      .get<ItunesMusicLookupResponse>(this.lookupUrl, {
        params: new HttpParams().set('id', artistId).set('entity', 'album').set('limit', '20'),
      })
      .pipe(
        map((response) =>
          response.results
            .filter(
              (item) => item.wrapperType !== 'artist' && Boolean(item.collectionId && item.collectionName),
            )
            .map((item) => this.toAlbumCartItem(item)),
        ),
      );
  }

  /**
   * Converts a search result into a cart item.
   */
  toSearchCartItem(item: SearchItem): CartItem {
    return {
      id: item.id,
      type: 'song',
      artistId: item.artistId,
      artistName: item.artistName,
      title: item.trackName,
      artworkUrl: item.artworkUrl,
      price: item.trackPrice,
      currency: item.currency,
      previewUrl: item.previewUrl,
    };
  }

  private toSongCartItem(item: ItunesMusicLookupResponse['results'][number]): CartItem {
    return {
      id: `song-${item.trackId!}`,
      type: 'song',
      artistId: item.artistId ?? 0,
      artistName: item.artistName ?? 'Unknown artist',
      title: item.trackName!,
      artworkUrl: item.artworkUrl100 ?? item.artworkUrl60 ?? '',
      price: item.trackPrice ?? 0,
      currency: item.currency ?? 'USD',
      previewUrl: item.previewUrl,
    };
  }

  private toAlbumCartItem(item: ItunesMusicLookupResponse['results'][number]): CartItem {
    return {
      id: `album-${item.collectionId!}`,
      type: 'album',
      artistId: item.artistId ?? 0,
      artistName: item.artistName ?? 'Unknown artist',
      title: item.collectionName!,
      artworkUrl: item.artworkUrl100 ?? item.artworkUrl60 ?? '',
      price: item.collectionPrice ?? 0,
      currency: item.currency ?? 'USD',
    };
  }
}
