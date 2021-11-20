import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import * as favoritesAction from './favorites.actions';
import {VideoProductionModel} from '../../../models/VideoProduction.model';
import {AccountModel} from "../../../models/account.model";

export const FavoritesAdapter: EntityAdapter<VideoProductionModel> = createEntityAdapter<VideoProductionModel>({
  selectId: vp => vp.uid
});

export interface FavoritesState extends EntityState<VideoProductionModel> {
  selectedFriend?: AccountModel
  selectedFriendsFavorites: VideoProductionModel[]
}

export const initialState: FavoritesState = FavoritesAdapter.getInitialState({
  selectedFriend: null,
  selectedFriendsFavorites: []
});

export function reducer(state: FavoritesState | undefined, action: Action): FavoritesState {
  return AccountReducer(state, action);
}

const AccountReducer = createReducer(
  initialState,
  on(favoritesAction.GetAllFavoritesActionSuccess,
    (state, {favorites}) => ({
      ...FavoritesAdapter.upsertMany(favorites, state)
    })),
  on(favoritesAction.AddToFavoritesActionSuccess,
    (state, {favorite}) => ({
      ...FavoritesAdapter.upsertOne(favorite, state)
    })),
  on(favoritesAction.RemoveFavoriteActionSuccess,
    (state, {favorite}) => ({
      ...FavoritesAdapter.removeOne(favorite.uid, state)
    })),
  on(favoritesAction.GetAllFavoritesFromFriendAction,
    (state, {account}) => ({
      ...state,
      selectedFriend: account,
      selectedFriendsFavorites: []
    })),
  on(favoritesAction.GetAllFavoritesFromFriendActionSuccess,
    (state, {favorites}) => ({
      ...state,
      selectedFriendsFavorites: favorites
    })),
  );

export const {
  selectAll: selectAllFavorites,
  selectIds,
  selectTotal,
} = FavoritesAdapter.getSelectors();

export function getAllFavorites(): (s: FavoritesState) => VideoProductionModel[] {
  return (state: FavoritesState) => selectAllFavorites(state);
}

export function getAllMovieFavorites(): (s: FavoritesState) => VideoProductionModel[] {
  return (state: FavoritesState) => selectAllFavorites(state).filter(val => val.productionType === 'MOVIE');
}

export function getAllShowFavorites(): (s: FavoritesState) => VideoProductionModel[] {
  return (state: FavoritesState) => selectAllFavorites(state).filter(val => val.productionType === 'TVSHOW');
}

export function getSelectedFriend(): (s: FavoritesState) => AccountModel {
  return (state: FavoritesState) => state.selectedFriend;
}

export function getAllFavoritesFromFriend(): (s: FavoritesState) => VideoProductionModel[] {
  return (state: FavoritesState) => state.selectedFriendsFavorites;
}

export function getAllFavoriteMoviesFromFriend(): (s: FavoritesState) => VideoProductionModel[] {
  return (state: FavoritesState) => state.selectedFriendsFavorites.filter(val => val.productionType === 'MOVIE');
}

export function getAllFavoriteShowsFromFriend(): (s: FavoritesState) => VideoProductionModel[] {
  return (state: FavoritesState) => state.selectedFriendsFavorites.filter(val => val.productionType === 'TVSHOW');
}
