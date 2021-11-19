import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {createSelector, select, Store} from '@ngrx/store';
import {VideoProductionModel} from '../../../models/VideoProduction.model';
import {AddToFavoritesAction, GetAllFavoritesAction, RemoveFromFavoritesAction} from '../../favorites/+state/favorites.actions';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as fromRoot from '../../../app.store';
import * as fromFavorites from '../../favorites/+state/favorites.reducer';
import * as fromWatchlist from '../../watchlist/+state/watchlist.reducer';
import {AddToWatchlistAction, GetAllWatchlistItemsAction, RemoveFromWatchlistAction} from '../../watchlist/+state/watchlist.actions';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit, OnDestroy {
  @Input() movie; // With Type does some problems
  favorites = [];
  watchlist = [];
  isAlreadyFavorite = false;
  isAlreadyInWatchlist = false;

  private unsubscribe$ = new Subject();

  constructor(
    private store: Store,
  ) {
  }

  ngOnInit(): void {

    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getAllFavorites()
      ))
    ).subscribe((favorites: VideoProductionModel[]) => {
      this.favorites = favorites;
      this.isAlreadyFavorite = this.favorites
        .find((fav) => {
          const productionType = this.getProductionType(this.movie);
          return fav.productionType === productionType && fav.movieId === this.movie.id;
        });
    });

    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getAllWatchlistItems()
      ))
    ).subscribe((watchlistItems: VideoProductionModel[]) => {
      this.watchlist = watchlistItems;
      this.isAlreadyInWatchlist = this.watchlist
        .find((item) => {
          const productionType = this.getProductionType(this.movie);
          return item.productionType === productionType && item.movieId === this.movie.id;
        });
    });
  }

  addToFavorites() {
    const productionType = this.getProductionType(this.movie);

    const favorite: VideoProductionModel = {
      movieId: this.movie.id,
      productionType,
      uid: productionType + this.movie.id
    };

    if (this.isAlreadyFavorite) {
      this.store.dispatch(RemoveFromFavoritesAction({favorite}));
    } else {
      this.store.dispatch(AddToFavoritesAction({favorite}));
    }

    this.store.dispatch(GetAllFavoritesAction());
  }

  addToWatchlist() {
    console.log('add to watchlist', this.isAlreadyInWatchlist);
    const productionType = this.getProductionType(this.movie);

    const favorite: VideoProductionModel = {
      movieId: this.movie.id,
      productionType,
      uid: productionType + this.movie.id
    };

    if (this.isAlreadyInWatchlist) {
      this.store.dispatch(RemoveFromWatchlistAction({favorite}));
    } else {
      this.store.dispatch(AddToWatchlistAction({favorite}));
    }

    this.store.dispatch(GetAllWatchlistItemsAction());
  }

  getProductionType(movie): string {
    return movie.name ? 'TVSHOW' : 'MOVIE';
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
