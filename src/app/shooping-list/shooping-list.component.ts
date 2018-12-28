import { ShoopingService } from './shooping.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shooping-list',
  templateUrl: './shooping-list.component.html',
  styleUrls: ['./shooping-list.component.css']
})
export class ShoopingListComponent implements OnInit {

  shoppingItems: Array<any> = [];
  total: number = 0;

  constructor(private shoopS: ShoopingService) { }

  ngOnInit() {
    this.shoppingItems = this.shoopS.getItems();
    this.shoopS.newItemsarreglo.subscribe(data => {
      this.shoppingItems = data;
    });
    this.getTotal();
  }

  getTotal() {
    if (this.shoppingItems.length) {
      this.total = this.shoppingItems.map((item) => {
        return (item.trackPrice) ? item.trackPrice : item.collectionPrice;
      }).reduce((total, num) => {
        return total + num;
      });
    }

  }

  // get Total(){
  // return this.total;
  // }

  // set Total(value){
  // this.total = value;
  // }

  changeTotal(e, item) {
    let price = (item.trackPrice) ? item.trackPrice : item.collectionPrice;

    if (e.srcElement.checked) {
      //Fixing the problem with big floating numbers
      this.total = parseFloat((this.total + price).toFixed(2));
    }
    else {
      this.total = parseFloat((this.total - price).toFixed(2));
    }
    console.log(this.total);
  }

  checked(e) {
    if (e.srcElement.checked) {
      // Array.from(document.querySelectorAll("input[type='checkbox']")).forEach((elem, index) => {
      //   elem.setAttribute('checked', '');
      // });
      let checkboxes = document.getElementsByTagName('input');
      for (var i in checkboxes) {
        if(checkboxes[i].type == 'checkbox')
        checkboxes[i].checked = true;
      }
      this.getTotal();
    }
    else {
      // Array.from(document.querySelectorAll("input[type='checkbox']")).forEach((elem, index) => {
      //   elem.removeAttribute('checked');
      // });
      let checkboxes = document.getElementsByTagName('input');
      for (var i in checkboxes) {
        if(checkboxes[i].type == 'checkbox')
        checkboxes[i].checked = false;
      }
      this.total = 0;
    }
  }
}
