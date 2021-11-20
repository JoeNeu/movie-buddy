import {Injectable} from '@angular/core';
import {createSelector, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {VideoProductionModel} from '../../models/VideoProduction.model';
import * as fromRoot from '../../app.store';
import * as fromWatchlist from '../watchlist/+state/watchlist.reducer';
import {getSelectedFriend} from "../watchlist/+state/watchlist.reducer";
import {AccountModel} from "../../models/account.model";

@Injectable({
  providedIn: 'root'
})
export class WatchlistSelectorService {

  constructor(
    private store: Store
  ) {
  }


  getAllWatchlistItemsFromStore(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getAllWatchlistItems())
      )
    );
  }

  getWatchlistMovies(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getAllWatchlistMoviesItems())
      )
    );
  }

  getWatchlistShows(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getAllWatchlistShowsItems())
      )
    );
  }

  getWatchlistMoviesFromFriend(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getAllWatchlistItemsMoviesFromFriend())
      )
    );
  }

  getWatchlistShowsFromFriend(): Observable<VideoProductionModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getAllWatchlistItemsShowsFromFriend())
      )
    );
  }

  getWatchlistSelectedFriend(): Observable<AccountModel> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.watchlistState, fromWatchlist.getSelectedFriend())
      )
    );
  }
}
