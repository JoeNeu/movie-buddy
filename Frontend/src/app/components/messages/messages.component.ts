import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, of, Subject, zip} from "rxjs";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";
import {SocialSelectorService} from "../../social/social-selector.service";
import {Store} from "@ngrx/store";
import {GetAllMessagesAction} from "../../social/+state/social.actions";
import {MessageDialogComponent} from "./message-dialog/message-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {getCurrentUserId} from "../../core/+state/core.reducer";
import {tmdbMovie, tmdbTvShow} from "../../models/the-movie-db.model";
import {MovieService} from "../../movies/movie.service";
import {MessageModel} from "../../models/message.model";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  friends;
  yourId;
  selectedFriend: AccountModel;

  constructor(
    private socialSelectorService: SocialSelectorService,
    private store: Store,
    public dialog: MatDialog,
    public movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(GetAllMessagesAction())

    this.store.select(getCurrentUserId).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((id: string) => this.yourId = id);

    // switchMap((friends: AccountModel[]) => {
    //   let movies = []
    //   let shows = []
    //   friends.forEach((friend: AccountModel) => {
    //     friend.messages.forEach((message: MessageModel) => {
    //       if(message.type === 'MOVIE')
    //         movies.push(message.movieId)
    //       if(message.type === 'TVSHOW')
    //         shows.push(message.movieId)
    //     })
    //   })
    //   debugger;
    //   // Bro dont even ask ...
    //   return combineLatest([
    //     of(friends),
    //     zip(...movies.map(value => this.movieService.getMovieById(value))),
    //     zip(...shows.map(value => this.movieService.getMovieById(value)))
    //   ]).pipe(
    //     map(([friends, movies, shows]) => {
    //       friends.forEach((friend: AccountModel) => {
    //         friend.messages.map((message: MessageModel) => {
    //           if(message.type === 'MOVIE') {
    //             let movie = movies.find(movie => movie.id === message.movieId)
    //             return {...message, movie: {...movie, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path}}
    //           }
    //
    //           if(message.type === 'TVSHOW') {
    //             let show = shows.find(show => show.id === message.movieId)
    //             return {...message, show: {...show, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + show.poster_path}}
    //           }
    //           return message
    //         })
    //       })
    //       return friends
    //     })
    //   )
    // })
    this.socialSelectorService.getAllFriendsFromStore().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((friends: AccountModel[]) => {
      this.friends = friends;
      if(this.selectedFriend) {
        this.selectedFriend = friends.find(friend => friend.id === this.selectedFriend.id)
      }
    });
  }

  setSelectedFriend(user: AccountModel) {
    this.selectedFriend = user;
  }

  sendMessage() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data: {
        receiver: this.selectedFriend.id,
      },
    });

    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if(reload) {
        this.store.dispatch(GetAllMessagesAction())
      }
    });
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
