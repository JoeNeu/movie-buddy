import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../account/account.service';
import {VideoProductionModel} from '../../models/VideoProduction.model';
import {createSelector, select, Store} from '@ngrx/store';
import {combineLatest, Subject, zip} from 'rxjs';
import {FavoritesSelectorService} from './favorites-selector.service';
import {GetAllFavoritesAction, GetAllFavoritesFromFriendAction} from './+state/favorites.actions';
import {MovieService} from '../../movies/movie.service';
import {tmdbMovie, tmdbTvShow} from '../../models/the-movie-db.model';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import * as fromRoot from '../../app.store';
import * as fromFavorites from './+state/favorites.reducer';
import {AccountModel} from "../../models/account.model";
import {SocialSelectorService} from "../../social/social-selector.service";
import {getAllFavoriteShowsFromFriend} from "./+state/favorites.reducer";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  favoriteMovies: tmdbMovie[] = [];
  favoriteTvShows: tmdbTvShow[] = [];

  favoriteMoviesFromFriend: tmdbMovie[] = [];
  favoriteTvShowsFromFriend: tmdbTvShow[] = [];

  friends: AccountModel[];
  selectedFriend: AccountModel;
  private unsubscribe$ = new Subject();

  constructor(
    private accountService: AccountService,
    private store: Store,
    private favoritesSelectorService: FavoritesSelectorService,
    private movieService: MovieService,
    private socialSelectorService: SocialSelectorService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(GetAllFavoritesAction());

    this.socialSelectorService.getAllFriendsFromStore().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((friends: AccountModel[]) => this.friends = friends);

    this.favoritesSelectorService.getFavoritesSelectedFriend().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( val => this.selectedFriend = val)

    this.favoritesSelectorService.getAllFavoriteMovies().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((movies: VideoProductionModel[]) => {
        return zip(...movies.map( v => this.movieService.getMovieById(v.movieId)))
      })
    ).subscribe((movies: tmdbMovie[]) => {
      this.favoriteMovies = movies.map(movie => {
        return {...movie, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path}
      })
    });

    this.favoritesSelectorService.getAllFavoriteShows().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((shows: VideoProductionModel[]) => {
        return zip(...shows.map( v => this.movieService.getTvShowById(v.movieId)))
      })
    ).subscribe((shows: tmdbTvShow[]) => {
      this.favoriteTvShows = shows.map(show => {
        return {...show, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + show.poster_path}
      })
    });

    this.favoritesSelectorService.getAllFavoriteMoviesFromFriend().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((movies: VideoProductionModel[]) => {
        return zip(...movies.map( v => this.movieService.getMovieById(v.movieId)))
      })
    ).subscribe((movies: tmdbMovie[]) => {
      this.favoriteMoviesFromFriend = movies.map(movie => {
        return {...movie, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path}
      })
    });

    this.favoritesSelectorService.getAllFavoriteShowsFromFriend().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((shows: VideoProductionModel[]) => {
        return zip(...shows.map( v => this.movieService.getTvShowById(v.movieId)))
      })
    ).subscribe((shows: tmdbTvShow[]) => {
      this.favoriteTvShowsFromFriend = shows.map(show => {
        return {...show, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + show.poster_path}
      })
    });
  }

  getFavoritesFromFriend(account: AccountModel) {
    this.favoriteMoviesFromFriend = [];
    this.favoriteTvShowsFromFriend = [];
    this.store.dispatch(GetAllFavoritesFromFriendAction({account}))
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

