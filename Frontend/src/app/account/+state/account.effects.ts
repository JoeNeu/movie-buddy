import {Injectable} from "@angular/core";
import {Actions} from "@ngrx/effects";

import * as accountActions from "./account.actions"
import {AccountService} from "../account.service";


@Injectable(
)
export class AccountEffects {

  constructor(
    private actions$: Actions,
    private accountService: AccountService
  ) {
  }



}
