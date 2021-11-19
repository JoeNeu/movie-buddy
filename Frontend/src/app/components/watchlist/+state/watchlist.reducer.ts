import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import * as watchlistAction from './watchlist.actions';
import {VideoProductionModel} from '../../../models/VideoProduction.model';

export const WatchlistAdapter: EntityAdapter<VideoProductionModel> = createEntityAdapter<VideoProductionModel>({
  selectId: vp => vp.uid
});

export interface WatchlistState extends EntityState<VideoProductionModel> {
}

export const initialState: WatchlistState = WatchlistAdapter.getInitialState({});

export function reducer(state: WatchlistState | undefined, action: Action): WatchlistState {
  return AccountReducer(state, action);
}

const AccountReducer = createReducer(
  initialState,
  on(watchlistAction.GetAllWatchlistItemsActionSuccess,
    (state, {favorites}) => ({
      ...WatchlistAdapter.upsertMany(favorites, state)
    })),
  on(watchlistAction.AddToWatchlistActionSuccess,
    (state, {favorite}) => ({
      ...WatchlistAdapter.upsertOne(favorite, state)
    })),
  on(watchlistAction.RemoveFromWatchlistActionSuccess,
    (state, {favorite}) => ({
      ...WatchlistAdapter.removeOne(favorite.uid, state)
    })),
  );

export const {
  selectAll: selectAllWatchlistItems,
  selectIds,
  selectTotal,
} = WatchlistAdapter.getSelectors();

export function getAllWatchlistItems(): (s: WatchlistState) => VideoProductionModel[] {
  return (state: WatchlistState) => selectAllWatchlistItems(state);
}
