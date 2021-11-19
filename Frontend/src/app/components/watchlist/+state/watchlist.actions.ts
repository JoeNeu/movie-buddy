import {createAction, props} from '@ngrx/store';
import {VideoProductionModel} from '../../../models/VideoProduction.model';

export const GetAllWatchlistItemsAction = createAction(
  '[Watchlist] Get all Watchlist Items',
);

export const GetAllWatchlistItemsActionSuccess = createAction(
  '[Watchlist] Get all Watchlist Items Success',
  props<{favorites: VideoProductionModel[]}>()
);

export const AddToWatchlistAction = createAction(
  '[Watchlist] Add To Watchlist',
  props<{favorite: VideoProductionModel}>()
);

export const AddToWatchlistActionSuccess = createAction(
  '[Watchlist] Add To Watchlist Success',
  props<{favorite: VideoProductionModel}>()
);

export const RemoveFromWatchlistAction = createAction(
  '[Watchlist] Remove Watchlist Item',
  props<{favorite: VideoProductionModel}>()
);

export const RemoveFromWatchlistActionSuccess = createAction(
  '[Watchlist] Remove Watchlist Item Success',
  props<{favorite: VideoProductionModel}>()
);
