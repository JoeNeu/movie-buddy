import {createAction, props} from '@ngrx/store';
import {AccountModel} from '../../models/account.model';
import {MessageModel} from "../../models/message.model";

export const GetAllFriendsAction = createAction(
  '[Social] Get all Friends',
);

export const GetAllFriendsActionSuccess = createAction(
  '[Social] Get all Friends Success',
  props<{accounts: AccountModel[]}>()
);

export const AddFriendAction = createAction(
  '[Social] Add Friend',
  props<{account: AccountModel}>()
);

export const AddFriendActionSuccess = createAction(
  '[Social] Add Friend Success',
  props<{account: AccountModel}>()
);

export const DeleteFriendAction = createAction(
  '[Social] Delete Friend',
  props<{id: string}>()
);

export const DeleteFriendActionSuccess = createAction(
  '[Social] Delete Friend Success',
  props<{id: string}>()
);

export const GetAllMessagesAction = createAction(
  '[Social] Get all Messages',
);

export const GetAllMessagesActionSuccess = createAction(
  '[Social] Get all Messages Success',
  props<{accounts: AccountModel[]}>()
);

export const SendMessageAction = createAction(
  '[Social] Send Messages',
  props<{message: MessageModel}>()
);

export const SendMessageActionSuccess = createAction(
  '[Social] Send Messages Success'
);
