import { Artist } from './artist.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist: Artist = new Artist('','');
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.http.get(`https://itunes.apple.com/lookup?id=${params['artistId']}`).subscribe( (data) =>
        {
          this.artist = new Artist(data['results'][0].artistName, data['results'][0].primaryGenreName) ;
        }
      );
    });
  }

}
