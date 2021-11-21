import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {SendMessageAction} from "../../../social/+state/social.actions";
import {MessageModel} from "../../../models/message.model";
import {takeUntil} from "rxjs/operators";
import {AccountModel} from "../../../models/account.model";
import {SocialSelectorService} from "../../../social/social-selector.service";
import {Subject} from "rxjs";
import {getCurrentUser} from "../../../core/+state/core.reducer";

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit, OnDestroy {

  messageText;
  message: MessageModel = new MessageModel();
  selectedFriend: AccountModel;
  friends;

  private unsubscribe$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    private store: Store,
    private socialSelectorService: SocialSelectorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.message.movieId = data.movieId ? data.movieId : 0;
    this.message.type = data.type ? data.type : '';
  }

  ngOnInit(): void {
    this.store.select(getCurrentUser).pipe(takeUntil(this.unsubscribe$)).subscribe(val => this.message.sender = val.id)

    this.socialSelectorService.getAllFriendsFromStore().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((friends: AccountModel[]) => {
      this.friends = friends
      if(this.data.receiver) {
        this.selectedFriend = friends.find(val => val.id === this.data.receiver)
      }
    });
  }

  setFriend(user: AccountModel) {
    this.selectedFriend = user;
  }

  sendMessage() {
    this.message.receiver = this.selectedFriend.id;
    this.message.text = this.messageText;
    this.store.dispatch(SendMessageAction({message: this.message}));
    this.dialogRef.close({reload: true});
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
