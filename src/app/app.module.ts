import { ArtistComponent } from './artist/artist.component';
import { SearchService } from './search/search.service';
import { SearchComponent } from './search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component,OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MapsComponent } from './maps/maps.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { ArtistSongsComponent } from './artist/artist-songs/artist-songs.component';
import { ArtistAlbumsComponent } from './artist/artist-albums/artist-albums.component';
import { HomeComponent } from './home/home.component';
import { ShoopingListComponent } from './shooping-list/shooping-list.component';
import { ShoopingService } from './shooping-list/shooping.service';


@Component({
  selector: 'app-root',
  template: `
  <app-header></app-header>
  <router-outlet></router-outlet>
  <!-- <app-maps></app-maps> -->
  `,
})
class AppComponent implements OnInit {

  constructor() { }
  
  ngOnInit() { }
  
}

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'prefix'},
  {path: 'home', component: HomeComponent},
  {path: 'shoopingcart', component: ShoopingListComponent},
  {path: 'search', component: SearchComponent},
  {path: 'artist/:artistId', component: ArtistComponent, children: [
    {path: '', redirectTo: 'songs', pathMatch: 'prefix'},
    {path: 'songs', component: ArtistSongsComponent},
    {path: 'albums', component: ArtistAlbumsComponent},
  ]}
]

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    HeaderComponent,
    SearchComponent,
    ArtistComponent,
    ArtistSongsComponent,
    ArtistAlbumsComponent,
    HomeComponent,
    ShoopingListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [SearchService, ShoopingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
