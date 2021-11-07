import { Injectable } from '@angular/core';
import {createSelector, select, Store} from "@ngrx/store";
import * as fromRoot from '../app.store';
import {Observable, of} from "rxjs";
import * as fromAccount from './+state/account.reducer';
import {AccountModel} from "../models/account.model";
import {map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccountSelectorService {

  constructor(private store: Store<fromRoot.State>) { }


  getAllAccountsFromStore(): Observable<AccountModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.accountState, fromAccount.getAllAccounts())
      )
    );
  }

  getAllOtherAccountsFromStore(id: string): Observable<AccountModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.accountState, fromAccount.getAllAccounts())
      ),
      map((accounts) => accounts.filter(account => account.id != id))
    );
  }

}
