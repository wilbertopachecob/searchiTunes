export interface SearchItem {
  trackName: string;
  artworkUrl60: string;
  previewUrl: string;
  artistId: number;
}

export interface ItunesSearchResponse {
  results: Array<{
    trackName: string;
    artworkUrl60: string;
    previewUrl: string;
    artistId: number;
  }>;
}
