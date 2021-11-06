import {Component, OnInit} from '@angular/core';
import {SearchService} from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  movieSearchValue = 'Title';

  constructor(private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.searchService.searchMovieTitle('asdf')
      .toPromise()
      .then((result) => console.log(result));

  }


}
