import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../account/account.service';
import {VideoProductionModel} from '../../models/VideoProduction.model';
import {createSelector, select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {FavoritesSelectorService} from './favorites-selector.service';
import {GetAllFavoritesAction} from './+state/favorites.actions';
import {MovieService} from '../../movies/movie.service';
import {tmdbMovie, tmdbTvShow} from '../../models/the-movie-db.model';
import {takeUntil} from 'rxjs/operators';
import * as fromRoot from '../../app.store';
import * as fromFavorites from './+state/favorites.reducer';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  favoriteMovies: tmdbMovie[] = [];
  favoriteTvShows: tmdbTvShow[] = [];

  private unsubscribe$ = new Subject();

  constructor(
    private accountService: AccountService,
    private store: Store,
    private favoritesSelectorService: FavoritesSelectorService,
    private movieService: MovieService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(GetAllFavoritesAction());

    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getAllFavorites()
      ))
    ).subscribe((favorites: VideoProductionModel[]) => {

      this.favoriteMovies = [];
      favorites.filter((fav) => fav.productionType === 'MOVIE').forEach((fav) => {
        this.movieService.getMovieById(fav.movieId).toPromise().then((movieSearchResult) => {
          const movie = {
            ...movieSearchResult,
            path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movieSearchResult.poster_path
          };
          this.favoriteMovies = [...this.favoriteMovies, movie];
        });
      });

      this.favoriteTvShows = [];
      favorites.filter((fav) => fav.productionType === 'TVSHOW').forEach((fav) => {
        this.movieService.getTvShowById(fav.movieId).toPromise().then((movieSearchResult) => {
          const tvShow = {
            ...movieSearchResult,
            path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movieSearchResult.poster_path
          };
          this.favoriteTvShows = [...this.favoriteTvShows, tvShow];
        });
      });
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

