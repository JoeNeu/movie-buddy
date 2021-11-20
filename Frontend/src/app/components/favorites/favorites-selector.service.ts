import {Injectable} from '@angular/core';
import {createSelector, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromRoot from '../../app.store';
import * as fromFavorites from '../../components/favorites/+state/favorites.reducer';
import {VideoProductionModel} from '../../models/VideoProduction.model';
import {AccountModel} from "../../models/account.model";
import {getSelectedFriend} from "../../components/favorites/+state/favorites.reducer";

@Injectable({
  providedIn: 'root'
})
export class FavoritesSelectorService {

  constructor(
    private store: Store
  ) {
  }


  getAllFavoritesFromStore(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getAllFavorites())
      )
    );
  }

  getAllFavoriteMovies(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getAllMovieFavorites())
      )
    );
  }

  getAllFavoriteShows(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getAllShowFavorites())
      )
    );
  }

  getAllFavoriteMoviesFromFriend(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getAllFavoriteMoviesFromFriend())
      )
    );
  }

  getAllFavoriteShowsFromFriend(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getAllFavoriteShowsFromFriend())
      )
    );
  }

  getFavoritesSelectedFriend(): Observable<AccountModel> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.favoritesState, fromFavorites.getSelectedFriend())
      )
    );
  }
}
