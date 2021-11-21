import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";
import {SocialSelectorService} from "../../social/social-selector.service";
import {Store} from "@ngrx/store";
import {GetAllMessagesAction} from "../../social/+state/social.actions";
import {MessageDialogComponent} from "./message-dialog/message-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MessageDialogData, MessageModel} from "../../models/message.model";
import {getCurrentUserId} from "../../core/+state/core.reducer";

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
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.store.dispatch(GetAllMessagesAction())

    this.store.select(getCurrentUserId).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((id: string) => this.yourId = id);

    this.socialSelectorService.getAllFriendsFromStore().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((friends: AccountModel[]) => this.friends = friends);
  }

  setSelectedFriend(user: AccountModel) {
    this.selectedFriend = user;
  }

  sendMessage() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data: {
        receiverName: this.selectedFriend.username,
        receiver: this.selectedFriend.id,
        sender: this.yourId,
      } as MessageDialogData,
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
