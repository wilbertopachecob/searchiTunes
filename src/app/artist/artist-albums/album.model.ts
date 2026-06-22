export interface Album {
  collectionName: string;
  collectionPrice: number;
  artworkUrl60: string;
}

export interface ItunesAlbumLookupResponse {
  results: Array<{
    wrapperType?: string;
    collectionName: string;
    collectionPrice: number;
    artworkUrl60: string;
  }>;
}
