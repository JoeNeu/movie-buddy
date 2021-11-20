import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {EMPTY, Observable} from 'rxjs';
import * as favoritesActions from './favorites.actions';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import {VideoProductionModel} from '../../../models/VideoProduction.model';
import {AccountService} from '../../../account/account.service';
import {CoreSelectorService} from '../../../core/core-selector.service';

@Injectable(
)
export class FavoritesEffects {

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private coreSelectorService: CoreSelectorService,
  ) {
  }

  @Effect()
  readonly getAllFavorites$: Observable<Action> = this.actions$.pipe(
    ofType(favoritesActions.GetAllFavoritesAction),
    switchMap(({}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.getAllFavorites(token).pipe(
            map((favorites: VideoProductionModel[]) => {
              return favoritesActions.GetAllFavoritesActionSuccess({favorites})
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
    ofType(favoritesActions.GetAllFavoritesFromFriendAction),
    switchMap(({account}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.getAllFavoritesFromFriends(token, account.id).pipe(
            map((favorites: VideoProductionModel[]) => {
              return favoritesActions.GetAllFavoritesFromFriendActionSuccess({favorites})
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
  readonly addToFavorites$: Observable<Action> = this.actions$.pipe(
    ofType(favoritesActions.AddToFavoritesAction),
    switchMap(({favorite}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.addToFavorites(favorite, token).pipe(
            map(_ => {
              const fav = {...favorite, uid : favorite.productionType + favorite.movieId}
              return favoritesActions.AddToFavoritesActionSuccess({favorite: fav})
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
  readonly removeFromFavorites$: Observable<Action> = this.actions$.pipe(
    ofType(favoritesActions.RemoveFromFavoritesAction),
    switchMap(({favorite}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.removeFromFavorites(favorite, token).pipe(
            map(_ => {
              return favoritesActions.RemoveFavoriteActionSuccess({favorite})
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
