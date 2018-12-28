import { SearchService } from './search.service';
import { Searchitems } from './searchitem.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { QueryList } from '@angular/core';
import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {

  private loading: boolean = false;
  searchItems: Observable<Searchitems[]>;
  @ViewChildren('audio') audios: QueryList<HTMLAudioElement>;
  private f: FormGroup;
  //private searchField: FormControl;

  constructor(private serviceS: SearchService, 
    private route: ActivatedRoute,
    private router: Router) { }

  doSearch(searchValue): Observable<Searchitems[]> {
    // this.searchItems = this.serviceS.search(searchValue.value);
    //return this.serviceS.search(searchValue);
    return this.serviceS.search(searchValue);
  }

  ngOnInit() {
    this.f = new FormGroup({
      'search': new FormControl()
    });

    this.route.params.subscribe(
      (params: Params) => {
        if (params['term']){
          this.searchItems = this.serviceS.search(params['term']);
        }
      }
    );


    //Esto funciona pero vamos a usar SwitchMap

    // this.f.get('search').valueChanges
    // .debounceTime(400)
    // .distinctUntilChanged()
    // .do(_ => this.loading = true)
    // .subscribe(res => {
    //   this.searchItems = this.serviceS.search(res);
    //   this.loading = false;
    // })

    //Usando SwitchMap para obtener lo mismo
    // this.searchItems = this.f.get('search').valueChanges
    //   .debounceTime(400)
    //   .distinctUntilChanged()
    //   .do(_ => this.loading = true)
    //   .switchMap(term => this.doSearch(term))
    //   .do(_ => this.loading = false);

    //Adding Router
    this.f.get('search').valueChanges.subscribe(term => 
      {
        this.router.navigate(['search', {term: term}])
    });
  }

  ngAfterViewInit() {
    //this.audios.changes.subscribe(res => console.log(res));
  }

  stopAll(audio: HTMLAudioElement) {
    this.audios.forEach(
      function (audiof) {
        if (audio !== audiof['nativeElement'])
          audiof['nativeElement'].pause();
      }
    );
  }

}
