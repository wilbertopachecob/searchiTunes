export interface Song {
  trackName: string;
  previewUrl: string;
  artworkUrl60: string;
  trackPrice: number;
}

export interface ItunesSongLookupResponse {
  results: Array<{
    wrapperType?: string;
    trackName: string;
    previewUrl: string;
    artworkUrl60: string;
    trackPrice: number;
  }>;
}
