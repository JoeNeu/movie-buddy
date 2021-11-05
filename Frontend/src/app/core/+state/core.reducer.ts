import {AccountModel} from "../../models/account.model";
import {Action, createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";

import * as accountAction from '../../account/+state/account.actions';

export interface CoreState {
  currentUser: AccountModel,
  nextRoute: string
}

export const initialState: CoreState = {
  currentUser: null,
  nextRoute: ''
}

export function reducer(state: CoreState | undefined, action: Action): CoreState {
  return CoreReducer(state, action);
}

const CoreReducer = createReducer(
  initialState,
  on(accountAction.LoginAction, accountAction.RegisterAction,
    (state, {route}) => ({
      ...state,
      nextRoute: route
    })),
  on(accountAction.LoginActionSuccess, accountAction.RegisterActionSuccess,
    (state, {account}) => ({
      ...state,
      currentUser: account
    })),
);

export const coreState = createFeatureSelector<CoreState>('core');
export const getCurrentUser = createSelector(coreState, (state: CoreState) => state.currentUser);
export const getCurrentUserToken = createSelector(coreState, (state: CoreState) => state.currentUser.token);
export const isCurrentUserAdmin = createSelector(coreState, (state: CoreState) => state.currentUser.isAdministrator);

export const getNextRoute = createSelector(coreState, (state: CoreState) => state.nextRoute)
