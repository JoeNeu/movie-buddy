import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AccountModel} from "../models/account.model";
import {createSelector, select, Store} from "@ngrx/store";
import * as fromRoot from "../app.store";
import * as fromSocial from "./+state/social.reducer";
import {filter, map} from "rxjs/operators";
import {getFriend} from "./+state/social.reducer";

@Injectable({
  providedIn: 'root'
})
export class SocialSelectorService {

  constructor(
    private store: Store
  ) { }


  getAllFriendsFromStore(): Observable<AccountModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.socialState, fromSocial.getAllFriends())
      ),
      map( val => val ? val : [])
    );
  }

  getFriendFromStore(id: string): Observable<AccountModel> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.socialState, fromSocial.getFriend(id))
      )
    );
  }
}
