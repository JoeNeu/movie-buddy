import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {AccountModel} from "../../models/Account.model";
import {Action, createReducer, on} from "@ngrx/store";

import * as restAction from './account.actions';

export const AccountAdapter: EntityAdapter<AccountModel> = createEntityAdapter<AccountModel>({
  selectId: vp => vp.id
});

export interface AccountState extends EntityState<AccountModel> {
}

export const initialState: AccountState = AccountAdapter.getInitialState({});

export function reducer(state: AccountState | undefined, action: Action): AccountState {
  return AccountReducer(state, action);
}

const AccountReducer = createReducer(
  initialState,
  // on(restAction.GetAllAccountsSuccess,
  //   (state, {Accounts}) => ({
  //     ...AccountAdapter.upsertMany(Accounts, state)
  //   })),
  // on(restAction.DeleteAccountByIdSuccess,
  //   (state, {id}) => ({
  //     ...AccountAdapter.removeOne(id, state)
  //   })),
);

export const {
  selectAll: selectAllAccounts,
  selectIds,
  selectTotal,
} = AccountAdapter.getSelectors();

export function getAllAccounts(): (s: AccountState) => AccountModel[] {
  return (state: AccountState) => selectAllAccounts(state)
}
