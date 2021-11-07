import {Component, OnInit, ViewChild} from '@angular/core';
import {MovieService} from '../../movies/movie.service';
import {tmdbModel, tmdbMovie, tmdbTvShow} from '../../models/the-movie-db.model';
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
  movieSearchResult = [];
  tvShowSearchResult = [];

  constructor(
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
    this.movieService.getMovieSearchResult(this.movieSearchValue)
      .subscribe((data: tmdbModel) => {
          this.movieSearchResult = data.results.map((obj) => {
            return {
              ...obj,
              path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
            };
          });
        }
      );

    this.movieService.getTvShowSearchResult(this.movieSearchValue)
      .subscribe((data: tmdbModel) => {
          this.tvShowSearchResult = data.results.map((obj) => {
            return {
              ...obj,
              path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
            };
          });
        }
      );
  }

}
