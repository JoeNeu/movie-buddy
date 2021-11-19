import {createAction, props} from '@ngrx/store';
import {VideoProductionModel} from '../../../models/VideoProduction.model';

export const GetAllFavoritesAction = createAction(
  '[Favorites] Get all Favorites',
);

export const GetAllFavoritesActionSuccess = createAction(
  '[Favorites] Get all Favorites Success',
  props<{favorites: VideoProductionModel[]}>()
);

export const AddToFavoritesAction = createAction(
  '[Favorites] Add To Favorites',
  props<{favorite: VideoProductionModel}>()
);

export const AddToFavoritesActionSuccess = createAction(
  '[Favorites] Add To Favorites Success',
  props<{favorite: VideoProductionModel}>()
);

export const RemoveFromFavoritesAction = createAction(
  '[Favorites] Remove Favorite',
  props<{favorite: VideoProductionModel}>()
);

export const RemoveFavoriteActionSuccess = createAction(
  '[Favorites] Remove Favorite Success',
  props<{favorite: VideoProductionModel}>()
);
