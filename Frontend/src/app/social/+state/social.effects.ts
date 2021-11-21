import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AccountService} from '../../account/account.service';
import {CoreSelectorService} from '../../core/core-selector.service';
import {Action} from '@ngrx/store';
import {combineLatest, EMPTY, Observable, of, zip} from 'rxjs';
import * as socialActions from './social.actions';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import {AccountModel} from '../../models/account.model';
import {SocialService} from "../social.service";
import {MessageModel} from "../../models/message.model";
import {SocialSelectorService} from "../social-selector.service";
import {MovieService} from "../../movies/movie.service";
import {tmdbMovie, tmdbTvShow} from "../../models/the-movie-db.model";

@Injectable(
)
export class SocialEffects {

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private socialService: SocialService,
    private coreSelectorService: CoreSelectorService,
    private socialSelectorService: SocialSelectorService,
    private movieService: MovieService
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
              return socialActions.ResolveMoviesAction({accounts: friends})
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
  readonly resolveMovies$: Observable<Action> = this.actions$.pipe(
    ofType(socialActions.ResolveMoviesAction),
    switchMap(({accounts}) => {
      let movies = []
      let shows = []
      accounts.forEach((friend: AccountModel) => {
        friend.messages.forEach((message: MessageModel) => {
          if (message.type === 'MOVIE')
            movies.push(message.movieId)
          if (message.type === 'TVSHOW')
            shows.push(message.movieId)
        })
      })
      return zip(
        of({}),
        ...movies.map((movie: number) => this.movieService.getMovieById(movie)),
        ...shows.map(show => this.movieService.getTvShowById(show))
      ).pipe(
        map((movies: (tmdbMovie|tmdbTvShow)[]) => {
          const friends = accounts.map((friend: AccountModel) => {
            return {...friend, messages: friend.messages.map((message: MessageModel) => {
                if(message.type === 'MOVIE' || message.type === 'TVSHOW') {
                  return { ...message, resolvedMovie: movies.find((val: (tmdbMovie|tmdbTvShow)) => val.id === message.movieId)}
                }
                return message
              })}
          })
          return socialActions.GetAllMessagesActionSuccess({accounts: friends})
        }),
        catchError(err => {
          console.warn(err);
          return EMPTY
        })
      );
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
