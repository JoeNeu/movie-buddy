import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import * as favoritesAction from './favorites.actions';
import {VideoProductionModel} from '../../../models/VideoProduction.model';

export const FavoritesAdapter: EntityAdapter<VideoProductionModel> = createEntityAdapter<VideoProductionModel>({
  selectId: vp => vp.movieId // TODO not unique
});

export interface FavoriteslState extends EntityState<VideoProductionModel> {
}

export const initialState: FavoriteslState = FavoritesAdapter.getInitialState({});

export function reducer(state: FavoriteslState | undefined, action: Action): FavoriteslState {
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
  // on(favoritesAction.DeleteFriendActionSuccess,
  //   (state, {id}) => ({
  //     ...FavoritesAdapter.removeOne(id, state)
  //   })),
);

export const {
  selectAll: selectAllFavorites,
  selectIds,
  selectTotal,
} = FavoritesAdapter.getSelectors();

export function getAllFriends(): (s: FavoriteslState) => VideoProductionModel[] {
  return (state: FavoriteslState) => selectAllFavorites(state);
}
