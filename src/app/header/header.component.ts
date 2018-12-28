import { Component, OnInit } from '@angular/core';
import { ShoopingService } from '../shooping-list/shooping.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  amountShooping: number;
  constructor(private shoopingS: ShoopingService) {
  }

  ngOnInit() {
    this.shoopingS.newItemsarreglo.subscribe(
      data => {
        this.amountShooping = data.length;
      },
      error => { console.log(error) });
  }

}
