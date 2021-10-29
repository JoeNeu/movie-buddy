import { Injectable } from '@angular/core';
import {createSelector, select, Store} from "@ngrx/store";
import * as fromRoot from '../app.store';
import {Observable} from "rxjs";
import * as fromAccount from './+state/account.reducer';
import {AccountModel} from "../models/account.model";

@Injectable({
  providedIn: 'root'
})
export class AccountSelectorService {

  constructor(private store: Store<fromRoot.State>) { }


  getAllAccountsFromStore(): Observable<AccountModel[]> {
    return this.store.pipe(
      select(createSelector(
        fromRoot.getCarState, fromAccount.getAllAccounts())
      )
    );
  }


}
