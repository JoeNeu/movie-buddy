import {Component, OnInit, ViewChild} from '@angular/core';
import {SearchService} from './search.service';
import {MovieService} from '../../movies/movie.service';
import {tmdbModel, tmdbMovie} from '../../models/the-movie-db.model';
import {MatAccordion} from '@angular/material/expansion';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  searchControl = new FormControl('');

  movieSearchValue = '';
  movieSearchResult: tmdbMovie[] = [];

  constructor(
    private searchService: SearchService,
    private movieService: MovieService
  ) {
  }

  ngOnInit(): void {
  }

  enterSubmit(event): void {
    if (event.keyCode === 13) {
      this.submitForm();
    }
  }

  submitForm(): void {
    this.movieService.getSearchResult(this.movieSearchValue)
      .subscribe((data: tmdbModel) => {
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
