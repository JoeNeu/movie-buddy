import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {AccountModel} from '../../models/account.model';
import {Action, createReducer, on} from '@ngrx/store';

import * as accountAction from './account.actions';

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
  on(accountAction.GetAllAccountsActionSuccess,
    (state, {accounts}) => ({
      ...AccountAdapter.upsertMany(accounts, state)
    })),
  // on(accountAction.DeleteAccountByIdSuccess,
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
