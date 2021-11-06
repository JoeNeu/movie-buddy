import {Component, OnInit, ViewChild} from '@angular/core';
import {SearchService} from './search.service';
import {MovieService} from '../../movies/movie.service';
import {tmdbModel, tmdbMovie} from '../../models/the-movie-db.model';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  movieSearchValue = 'Title';
  movieSearchResult: tmdbMovie[] = [];

  constructor(
    private searchService: SearchService,
    private movieService: MovieService
  ) {
  }

  ngOnInit(): void {
    // this.searchService.searchMovieTitle('asdf')
    //   .toPromise()
    //   .then((result) => console.log(result));


    this.movieService.getSearchResult('test')
      .subscribe((data: tmdbModel) => {
          console.log(data.results);
          console.log(this.movieSearchResult);

          this.movieSearchResult = data.results.map((obj) => {
            return {
              ...obj,
              path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
            };
          });
        }
      );

  }


}
