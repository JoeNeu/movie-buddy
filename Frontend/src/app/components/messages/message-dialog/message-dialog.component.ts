import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {SendMessageAction} from "../../../social/+state/social.actions";
import {MessageDialogData} from "../../../models/message.model";

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  messageText;

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessageDialogData,
    private store: Store
  ) {
  }

  ngOnInit(): void {
  }

  sendMessage() {
    const message = {
      sender: this.data.sender,
      receiver: this.data.receiver,
      text: this.messageText,
      movieId: this.data.movieId
    }
    this.store.dispatch(SendMessageAction({message: message}));
    this.dialogRef.close({reload: true});
  }
}
