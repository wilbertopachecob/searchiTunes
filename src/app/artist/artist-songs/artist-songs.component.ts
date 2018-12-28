import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { Song } from './song.model';
import { ShoopingService } from '../../shooping-list/shooping.service';

@Component({
  selector: 'app-artist-songs',
  templateUrl: './artist-songs.component.html',
  styleUrls: ['./artist-songs.component.css']
})
export class ArtistSongsComponent implements OnInit {

  canciones: Song[] = [];

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
  private shoopS: ShoopingService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      //https://itunes.apple.com/lookup?id=909253
      this.http.get('https://itunes.apple.com/lookup',
        {
          params: new HttpParams()
            .set('id', params.artistId)
            .set('entity', 'song')
            .set('limit', '10')
        }).map(res => {
          //console.log(res['results']);
          res['results'].shift();
          return res['results'].map(song => {
            return new Song(
              song.trackName,
              song.previewUrl,
              song.artworkUrl60,
              song.trackPrice
            );
          })
        })
        .subscribe((data: Song[]) => {
          this.canciones = data;
        });
    });
  }

  addToCartS(song: Song){
    this.shoopS.addItem(song);
  }

}
