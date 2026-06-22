export interface Artist {
  artistName: string;
  primaryGenreName: string;
}

export interface ItunesLookupResponse {
  results: Array<{
    artistName: string;
    primaryGenreName: string;
  }>;
}
