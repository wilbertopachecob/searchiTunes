import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShoopingService{

  items: Array<any> = []; 
  newItemsarreglo = new Subject<Array<any>>();

  constructor() { 
  }

  getItems() : Array<any>{
    return this.items.slice();
  }

  addItem(item): void{
    console.log(item);
    if(this.items.indexOf(item) == -1)
    {
      this.items.push(item);
      this.newItemsarreglo.next(this.items.slice());
    }
  }

}
