import {ActionReducerMap, createFeatureSelector, MetaReducer} from '@ngrx/store';
import {storeFreeze} from 'ngrx-store-freeze';
import * as fromAccount from './account/+state/account.reducer';
import * as fromCore from './core/+state/core.reducer';
import {environment} from "../environments/environment";

export interface State {
  account: fromAccount.AccountState;
  core: fromCore.CoreState;
}


export const reducers: ActionReducerMap<State> = {
  account: fromAccount.reducer,
  core: fromCore.reducer
};

export const metaReducers: MetaReducer<State>[] = !(environment.production)
  ? [storeFreeze]
  : [];


export const accountState = createFeatureSelector<fromAccount.AccountState>('account');
