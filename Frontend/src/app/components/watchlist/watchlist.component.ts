import {Component, OnDestroy, OnInit} from '@angular/core';
import {tmdbMovie, tmdbTvShow} from '../../models/the-movie-db.model';
import {Subject} from 'rxjs';
import {AccountService} from '../../account/account.service';
import {createSelector, select, Store} from '@ngrx/store';
import {MovieService} from '../../movies/movie.service';
import {takeUntil} from 'rxjs/operators';
import * as fromRoot from '../../app.store';
import * as fromWatchlist from '../watchlist/+state/watchlist.reducer';
import {VideoProductionModel} from '../../models/VideoProduction.model';
import {WatchlistSelectorService} from './watchlist-selector.service';
import {GetAllWatchlistItemsAction} from './+state/watchlist.actions';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  watchlistMovies: tmdbMovie[] = [];
  watchlistTvShows: tmdbTvShow[] = [];

  private unsubscribe$ = new Subject();

  constructor(
    private accountService: AccountService,
    private store: Store,
    private watchlistSelectorService: WatchlistSelectorService,
    private movieService: MovieService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(GetAllWatchlistItemsAction());

    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getAllWatchlistItems()
      ))
    ).subscribe((watchlistItems: VideoProductionModel[]) => {

      this.watchlistMovies = [];
      watchlistItems.filter((item) => item.productionType === 'MOVIE').forEach((item) => {
        this.movieService.getMovieById(item.movieId).toPromise().then((movieSearchResult) => {
          const movie = {
            ...movieSearchResult,
            path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movieSearchResult.poster_path
          };
          this.watchlistMovies = [...this.watchlistMovies, movie];
        });
      });

      this.watchlistTvShows = [];
      watchlistItems.filter((item) => item.productionType === 'TVSHOW').forEach((item) => {
        this.movieService.getTvShowById(item.movieId).toPromise().then((movieSearchResult) => {
          const tvShow = {
            ...movieSearchResult,
            path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movieSearchResult.poster_path
          };
          this.watchlistTvShows = [...this.watchlistTvShows, tvShow];
        });
      });
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
