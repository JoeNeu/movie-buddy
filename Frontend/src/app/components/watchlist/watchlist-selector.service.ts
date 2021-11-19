import {Injectable} from '@angular/core';
import {createSelector, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {VideoProductionModel} from '../../models/VideoProduction.model';
import * as fromRoot from '../../app.store';
import * as fromWatchlist from '../watchlist/+state/watchlist.reducer';

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
}
