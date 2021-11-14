import {Injectable} from '@angular/core';
import {createSelector, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromRoot from '../../app.store';
import * as fromFavorites from '../../components/favorites/+state/favorites.reducer';
import {VideoProductionModel} from '../../models/VideoProduction.model';

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
        fromRoot.favoritesState, fromFavorites.getAllFriends())
      )
    );
  }
}
