import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {EMPTY, Observable} from 'rxjs';
import * as watchlistActions from './watchlist.actions';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import {VideoProductionModel} from '../../../models/VideoProduction.model';
import {AccountService} from '../../../account/account.service';
import {CoreSelectorService} from '../../../core/core-selector.service';
import {SocialService} from "../../../social/social.service";

@Injectable(
)
export class WatchlistEffects {

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private socialService: SocialService,
    private coreSelectorService: CoreSelectorService,
  ) {
  }

  @Effect()
  readonly getAllWatchlistItems$: Observable<Action> = this.actions$.pipe(
    ofType(watchlistActions.GetAllWatchlistItemsAction),
    switchMap(({}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.getAllWatchlistItems(token).pipe(
            map((favorites: VideoProductionModel[]) => {
              return watchlistActions.GetAllWatchlistItemsActionSuccess({favorites})
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
  readonly getAllFavoritesFromFriend$: Observable<Action> = this.actions$.pipe(
    ofType(watchlistActions.GetAllWatchlistItemsFromFriendAction),
    switchMap(({account}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.socialService.getAllWatchlistItemsFromFriends(token, account.id).pipe(
            map((favorites: VideoProductionModel[]) => {
              return watchlistActions.GetAllWatchlistItemsFromFriendActionSuccess({favorites})
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
  readonly addToWatchlist$: Observable<Action> = this.actions$.pipe(
    ofType(watchlistActions.AddToWatchlistAction),
    switchMap(({favorite}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.addToWatchlist(favorite, token).pipe(
            map(_ => {
              const fav = {...favorite, uid : favorite.productionType + favorite.movieId}
              return watchlistActions.AddToWatchlistActionSuccess({favorite: fav})
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
  readonly removeFromWatchlist$: Observable<Action> = this.actions$.pipe(
    ofType(watchlistActions.RemoveFromWatchlistAction),
    switchMap(({favorite}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.removeFromWatchlist(favorite, token).pipe(
            map(_ => {
              return watchlistActions.RemoveFromWatchlistActionSuccess({favorite})
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
