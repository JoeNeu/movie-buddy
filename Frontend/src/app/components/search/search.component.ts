import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MovieService} from '../../movies/movie.service';
import {tmdbModel} from '../../models/the-movie-db.model';
import {MatAccordion} from '@angular/material/expansion';
import {FormControl} from '@angular/forms';
import {ViewportScroller} from "@angular/common";
import {Store} from "@ngrx/store";
import {getCurrentUser} from "../../core/+state/core.reducer";
import {takeUntil} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild("movieAnchor") MyProp: ElementRef;

  searchControl = new FormControl('');

  movieSearchValue = '';
  movieSearchResult = [];
  tvShowSearchResult = [];

  loggedIn = false;
  currentUser;
  private unsubscribe$ = new Subject();

  constructor(
    private movieService: MovieService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.select(getCurrentUser).pipe(takeUntil(this.unsubscribe$)).subscribe((user: AccountModel) => {
      if(user) {
        this.loggedIn = true;
        this.currentUser = user;
      }
    })
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
        this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
