import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {AccountModel} from '../../models/account.model';
import {Action, createReducer, on} from '@ngrx/store';

import * as socialAction from './social.actions';

export const SocialAdapter: EntityAdapter<AccountModel> = createEntityAdapter<AccountModel>({
  selectId: vp => vp.id
});

export interface SocialState extends EntityState<AccountModel> {
}

export const initialState: SocialState = SocialAdapter.getInitialState({});

export function reducer(state: SocialState | undefined, action: Action): SocialState {
  return AccountReducer(state, action);
}

const AccountReducer = createReducer(
  initialState,
  on(socialAction.GetAllFriendsActionSuccess,
    (state, {accounts}) => ({
      ...SocialAdapter.upsertMany(accounts, state)
    })),
  on(socialAction.AddFriendActionSuccess,
    (state, {account}) => ({
      ...SocialAdapter.upsertOne(account, state)
    })),
  on(socialAction.DeleteFriendActionSuccess,
    (state, {id}) => ({
      ...SocialAdapter.removeOne(id, state)
    })),
  on(socialAction.GetAllMessagesActionSuccess,
    (state, {accounts}) => ({
      ...SocialAdapter.upsertMany(accounts, state)
    })),
);

export const {
  selectAll: selectAllSocial,
  selectIds,
  selectTotal,
} = SocialAdapter.getSelectors();

export function getAllFriends(): (s: SocialState) => AccountModel[] {
  return (state: SocialState) => selectAllSocial(state)
}
export function getFriend(id: string): (s: SocialState) => AccountModel {
  return (state: SocialState) => selectAllSocial(state).find(value => value.id === id)
}
