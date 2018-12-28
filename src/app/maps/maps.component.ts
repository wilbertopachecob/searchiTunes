import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  //@ViewChild('gmap') gmapElement: any;
  //map: google.maps.Map;

  ngOnInit() {
    //var posicion = new google.maps.LatLng(36.134857, -95.954327);
    //var posicion = {lat:36.134857, lng:-95.954327};
    if ("geolocation" in navigator) {
      /* la geolocalización está disponible */
      navigator.geolocation.getCurrentPosition(function(position) {
        var posicion = {lat: position.coords.latitude, lng: position.coords.longitude};
        var mapProp = {
          center: posicion,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        let map: google.maps.Map;
        var gmapN = document.querySelector("#gmapN"); 
        //var gmapN = this.gmapElement.nativeElement;
        // console.log("Query Selector",document.querySelector("#gmapN"));
        // console.log("Native element",this.gmapElement.nativeElement);
        map = new google.maps.Map(gmapN, mapProp);
        var marker = new google.maps.Marker({
          position: posicion,
          map: map,
        });
      });
    } 



    // To add the marker to the map, call setMap();
    //marker.setMap(this.map);
  }

}
