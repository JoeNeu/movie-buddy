import {ActionReducerMap, createFeatureSelector, MetaReducer} from '@ngrx/store';
import {storeFreeze} from 'ngrx-store-freeze';
import * as fromAccount from './account/+state/account.reducer';
import * as fromSocial from './social/+state/social.reducer';
import * as fromFavorites from './components/favorites/+state/favorites.reducer';
import * as fromCore from './core/+state/core.reducer';
import {environment} from "../environments/environment";

export interface State {
  account: fromAccount.AccountState;
  core: fromCore.CoreState;
  social: fromSocial.SocialState;
  favorites: fromFavorites.FavoritesState;
}


export const reducers: ActionReducerMap<State> = {
  account: fromAccount.reducer,
  core: fromCore.reducer,
  social: fromSocial.reducer,
  favorites: fromFavorites.reducer
};

export const metaReducers: MetaReducer<State>[] = !(environment.production)
  ? [storeFreeze]
  : [];


export const accountState = createFeatureSelector<fromAccount.AccountState>('account');
export const socialState = createFeatureSelector<fromSocial.SocialState>('social');
export const favoritesState = createFeatureSelector<fromFavorites.FavoritesState>('favorites');
