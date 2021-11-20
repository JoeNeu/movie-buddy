import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, createSelector, on} from '@ngrx/store';

import * as watchlistAction from './watchlist.actions';
import {VideoProductionModel} from '../../../models/VideoProduction.model';
import {AccountModel} from "../../../models/account.model";
import {watchlistState} from "../../../app.store";

export const WatchlistAdapter: EntityAdapter<VideoProductionModel> = createEntityAdapter<VideoProductionModel>({
  selectId: vp => vp.uid
});

export interface WatchlistState extends EntityState<VideoProductionModel> {
  selectedFriend?: AccountModel
  selectedFriendsWatchList: VideoProductionModel[]
}

export const initialState: WatchlistState = WatchlistAdapter.getInitialState({
  selectedFriend: null,
  selectedFriendsWatchList: []
});

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
  on(watchlistAction.GetAllWatchlistItemsFromFriendAction,
    (state, {account}) => ({
      ...state,
      selectedFriend: account,
      selectedFriendsWatchList: []
    })),
  on(watchlistAction.GetAllWatchlistItemsFromFriendActionSuccess,
    (state, {favorites}) => ({
      ...state,
      selectedFriendsWatchList: favorites
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

export function getAllWatchlistMoviesItems(): (s: WatchlistState) => VideoProductionModel[] {
  return (state: WatchlistState) => selectAllWatchlistItems(state).filter(val => val.productionType === 'MOVIE');
}

export function getAllWatchlistShowsItems(): (s: WatchlistState) => VideoProductionModel[] {
  return (state: WatchlistState) => selectAllWatchlistItems(state).filter(val => val.productionType === 'TVSHOW');
}

export function getSelectedFriend(): (s: WatchlistState) => AccountModel {
  return (state: WatchlistState) => state.selectedFriend;
}

export function getAllWatchlistItemsFromFriend(): (s: WatchlistState) => VideoProductionModel[] {
  return (state: WatchlistState) => state.selectedFriendsWatchList;
}

export function getAllWatchlistItemsMoviesFromFriend(): (s: WatchlistState) => VideoProductionModel[] {
  return (state: WatchlistState) => state.selectedFriendsWatchList.filter(val => val.productionType === 'MOVIE');
}

export function getAllWatchlistItemsShowsFromFriend(): (s: WatchlistState) => VideoProductionModel[] {
  return (state: WatchlistState) => state.selectedFriendsWatchList.filter(val => val.productionType === 'TVSHOW');
}
