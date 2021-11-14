import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import * as favoritesAction from './favorites.actions';
import {VideoProductionModel} from '../../../models/VideoProduction.model';

export const FavoritesAdapter: EntityAdapter<VideoProductionModel> = createEntityAdapter<VideoProductionModel>({
  selectId: vp => vp.uid
});

export interface FavoritesState extends EntityState<VideoProductionModel> {
}

export const initialState: FavoritesState = FavoritesAdapter.getInitialState({});

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
  );

export const {
  selectAll: selectAllFavorites,
  selectIds,
  selectTotal,
} = FavoritesAdapter.getSelectors();

export function getAllFavorites(): (s: FavoritesState) => VideoProductionModel[] {
  return (state: FavoritesState) => selectAllFavorites(state);
}
