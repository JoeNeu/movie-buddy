import {Component, OnDestroy, OnInit} from '@angular/core';
import {tmdbMovie, tmdbTvShow} from '../../models/the-movie-db.model';
import {Subject, zip} from 'rxjs';
import {AccountService} from '../../account/account.service';
import {Store} from '@ngrx/store';
import {MovieService} from '../../movies/movie.service';
import {switchMap, takeUntil} from 'rxjs/operators';

import {VideoProductionModel} from '../../models/VideoProduction.model';
import {WatchlistSelectorService} from './watchlist-selector.service';
import {GetAllWatchlistItemsAction, GetAllWatchlistItemsFromFriendAction} from './+state/watchlist.actions';
import {AccountModel} from "../../models/account.model";
import {SocialSelectorService} from "../../social/social-selector.service";
import {getSelectedFriend} from "./+state/watchlist.reducer";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  watchlistMovies: tmdbMovie[] = [];
  watchlistTvShows: tmdbTvShow[] = [];

  watchlistMoviesFromFriend: tmdbMovie[] = [];
  watchlistTvShowsFromFriend: tmdbTvShow[] = [];

  private unsubscribe$ = new Subject();
  friends;
  selectedFriend: AccountModel;

  constructor(
    private accountService: AccountService,
    private store: Store,
    private watchlistSelectorService: WatchlistSelectorService,
    private movieService: MovieService,
    private socialSelectorService: SocialSelectorService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(GetAllWatchlistItemsAction());

    this.watchlistSelectorService.getWatchlistSelectedFriend().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( val => this.selectedFriend = val)

    this.socialSelectorService.getAllFriendsFromStore().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((friends: AccountModel[]) => this.friends = friends);

    this.watchlistSelectorService.getWatchlistMovies().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((movies: VideoProductionModel[]) => {
        return zip(...movies.map( v => this.movieService.getMovieById(v.movieId)))
      })
    ).subscribe((movies: tmdbMovie[]) => {
      this.watchlistMovies = movies.map(movie => {
        return {...movie, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path}
      })
    });

    this.watchlistSelectorService.getWatchlistShows().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((shows: VideoProductionModel[]) => {
        return zip(...shows.map( v => this.movieService.getTvShowById(v.movieId)))
      })
    ).subscribe((shows: tmdbTvShow[]) => {
      this.watchlistTvShows = shows.map(show => {
        return {...show, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + show.poster_path}
      })
    });

    this.watchlistSelectorService.getWatchlistMoviesFromFriend().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((movies: VideoProductionModel[]) => {
        return zip(...movies.map( v => this.movieService.getMovieById(v.movieId)))
      })
    ).subscribe((movies: tmdbMovie[]) => {
      this.watchlistMoviesFromFriend = movies.map(movie => {
        return {...movie, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path}
      })
    });

    this.watchlistSelectorService.getWatchlistShowsFromFriend().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((shows: VideoProductionModel[]) => {
        return zip(...shows.map( v => this.movieService.getTvShowById(v.movieId)))
      })
    ).subscribe((shows: tmdbTvShow[]) => {
      this.watchlistTvShowsFromFriend = shows.map(show => {
        return {...show, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + show.poster_path}
      })
    });
  }

  getWatchListFromFriend(account: AccountModel) {
    this.watchlistMoviesFromFriend = [];
    this.watchlistTvShowsFromFriend = [];
    this.store.dispatch(GetAllWatchlistItemsFromFriendAction({account}))
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
