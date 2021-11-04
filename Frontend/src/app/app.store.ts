import {ActionReducerMap, createFeatureSelector, MetaReducer} from '@ngrx/store';
import {storeFreeze} from 'ngrx-store-freeze';
import * as fromAccount from './account/+state/account.reducer';
import {environment} from "../environments/environment";

export interface State {
  car: fromAccount.AccountState;
}


export const reducers: ActionReducerMap<State> = {
  car: fromAccount.reducer
};

export const metaReducers: MetaReducer<State>[] = !(environment.production)
  ? [storeFreeze]
  : [];


export const getCarState = createFeatureSelector<fromAccount.AccountState>('Account');
