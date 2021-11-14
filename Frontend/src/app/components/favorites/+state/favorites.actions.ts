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
  props<{videoProduction: VideoProductionModel}>()
);

export const AddToFavoritesActionSuccess = createAction(
  '[Favorites] Add To Favorites Success',
  props<{favorite: VideoProductionModel}>()
);
