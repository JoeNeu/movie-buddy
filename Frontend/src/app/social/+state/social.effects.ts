import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AccountService} from '../../account/account.service';
import {CoreSelectorService} from '../../core/core-selector.service';
import {Action} from '@ngrx/store';
import {combineLatest, EMPTY, Observable, zip} from 'rxjs';
import * as socialActions from './social.actions';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import {AccountModel} from '../../models/account.model';
import {SocialService} from "../social.service";
import {MessageModel} from "../../models/message.model";
import {SocialSelectorService} from "../social-selector.service";

@Injectable(
)
export class SocialEffects {

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private socialService: SocialService,
    private coreSelectorService: CoreSelectorService,
    private socialSelectorService: SocialSelectorService
  ) {
  }

  @Effect()
  readonly getAllFriends$: Observable<Action> = this.actions$.pipe(
    ofType(socialActions.GetAllFriendsAction),
    exhaustMap(({}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.getAllFriends(token).pipe(
            map((accounts: AccountModel[]) => {
              return socialActions.GetAllFriendsActionSuccess({accounts})
            }),
            catchError(err => {
              console.warn(err);
              return EMPTY
            })
          );
        })
      )
    })
  );

  @Effect()
  readonly addFriend$: Observable<Action> = this.actions$.pipe(
    ofType(socialActions.AddFriendAction),
    switchMap(({account}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.addFriend(account.id, token).pipe(
            map(_ => {
              return socialActions.AddFriendActionSuccess({account})
            }),
            catchError(err => {
              console.warn(err);
              return EMPTY
            })
          );
        })
      )
    })
  );

  @Effect()
  readonly deleteFriend$: Observable<Action> = this.actions$.pipe(
    ofType(socialActions.DeleteFriendAction),
    switchMap(({id}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.removeFriend(id, token).pipe(
            map(_ => {
              return socialActions.DeleteFriendActionSuccess({id})
            }),
            catchError(err => {
              console.warn(err);
              return EMPTY
            })
          );
        })
      )
    })
  );

  @Effect()
  readonly getAllMessages$: Observable<Action> = this.actions$.pipe(
    ofType(socialActions.GetAllMessagesAction),
    switchMap(({}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return combineLatest([
            this.socialService.getAllMessages(token),
            this.accountService.getAllFriends(token)
          ]).pipe(
            map(([messages, friends]: [MessageModel[], AccountModel[]]) => {
              friends.forEach((friend, index) => {
                friends[index].messages = messages.filter(message => message.sender === friend.id || message.receiver === friend.id)
              })
              return socialActions.GetAllMessagesActionSuccess({accounts: friends})
            }),
            catchError(err => {
              console.warn(err);
              return EMPTY
            })
          );
        })
      )
    })
  );

  @Effect()
  readonly sendMessage$: Observable<Action> = this.actions$.pipe(
    ofType(socialActions.SendMessageAction),
    switchMap(({message}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.socialService.sendMessage(token, message).pipe(
            map(_ => {
              return socialActions.SendMessageActionSuccess()
            }),
            catchError(err => {
              console.warn(err);
              return EMPTY
            })
          );
        })
      )
    })
  );

}
