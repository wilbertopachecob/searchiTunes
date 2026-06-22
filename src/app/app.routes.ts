import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'shopping-cart',
    loadComponent: () =>
      import('./shopping-cart/shopping-cart.component').then((m) => m.ShoppingCartComponent),
  },
  { path: 'shoopingcart', redirectTo: 'shopping-cart', pathMatch: 'full' },
  {
    path: 'artist/:artistId',
    loadComponent: () => import('./artist/artist.component').then((m) => m.ArtistComponent),
    children: [
      { path: '', redirectTo: 'songs', pathMatch: 'full' },
      {
        path: 'songs',
        loadComponent: () =>
          import('./artist/artist-songs/artist-songs.component').then((m) => m.ArtistSongsComponent),
      },
      {
        path: 'albums',
        loadComponent: () =>
          import('./artist/artist-albums/artist-albums.component').then((m) => m.ArtistAlbumsComponent),
      },
    ],
  },
];
