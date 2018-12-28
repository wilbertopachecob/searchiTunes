import { Albums } from './albums-model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ShoopingService } from '../../shooping-list/shooping.service';

@Component({
  selector: 'app-artist-albums',
  templateUrl: './artist-albums.component.html',
  styleUrls: ['./artist-albums.component.css']
})
export class ArtistAlbumsComponent implements OnInit {

  albums: Albums[] = [];

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
  private shoopSer: ShoopingService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.http.get(`https://itunes.apple.com/lookup?id=${params['artistId']}&entity=album&limit=10`)
      .map(res => {
        res['results'].shift();
        return res['results'].map(album => {
          return new Albums(album.collectionName, album.collectionPrice, album.artworkUrl60)
        });
      })
      .subscribe( (data: Albums[]) =>
        {
          this.albums = data;
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  addToCartA(album: Albums){
    this.shoopSer.addItem(album);
  }

}
