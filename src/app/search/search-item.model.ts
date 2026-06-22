export interface SearchItem {
  id: string;
  artistName: string;
  trackName: string;
  artworkUrl: string;
  previewUrl: string;
  artistId: number;
  trackPrice: number;
  currency: string;
}

export interface ItunesSearchResponse {
  results: Array<{
    trackId: number;
    artistName: string;
    trackName: string;
    artworkUrl100: string;
    previewUrl: string;
    artistId: number;
    trackPrice?: number;
    currency?: string;
  }>;
}
