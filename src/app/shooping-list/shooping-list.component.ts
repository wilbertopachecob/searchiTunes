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
      let a: number = 0;
      a = this.shoppingItems.map((item) => {
        return (item.trackPrice) ? item.trackPrice : item.collectionPrice;
      }).reduce((total, num) => {
        return total + num;
      });
      this.total = parseFloat((a).toFixed(2));
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
    //Casting the element so it wont trow me an error
    //With this we unckeck the main checkbox selector everytime the user clicks on th other ones
    (<HTMLInputElement>document.getElementById('selectAll')).checked = false;
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
      //For some weird reason this is not working =(
      // Array.from(document.querySelectorAll("input[type='checkbox']")).forEach((elem, index) => {
      //   elem.setAttribute('checked', '');
      // });
      let checkboxes = document.getElementsByTagName('input');
      for (var i in checkboxes) {
        if (checkboxes[i].type == 'checkbox')
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
        if (checkboxes[i].type == 'checkbox')
          checkboxes[i].checked = false;
      }
      this.total = 0;
    }
  }

  buy(form) {
    //do something to 
    console.log('Im buying staff');

  }
}
