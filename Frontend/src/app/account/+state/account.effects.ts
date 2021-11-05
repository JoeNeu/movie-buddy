import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";

import * as accountActions from "./account.actions"
import {AccountService} from "../account.service";
import {EMPTY, Observable, of} from "rxjs";
import {Action, select, Store} from "@ngrx/store";
import {catchError, exhaustMap, first, map, switchMap, tap} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";
import {Router} from "@angular/router";
import {getNextRoute} from "../../core/+state/core.reducer";


@Injectable(
)
export class AccountEffects {

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private router: Router,
    private store: Store
  ) {
  }

  @Effect()
  readonly loginRequest$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.LoginAction),
    exhaustMap(({loginDto, route}) => {
      return this.accountService.login(loginDto).pipe(
        map((account: AccountModel) => {
          return accountActions.LoginActionSuccess({account, route})
        }),
        catchError(err => {
          console.warn(err);
          return EMPTY
        })
      );
    })
  );

  @Effect()
  readonly registerRequest$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.RegisterAction),
    exhaustMap(({registerDto, route}) => {
      return this.accountService.register(registerDto).pipe(
        map((account: AccountModel) => {
          return accountActions.RegisterActionSuccess({account, route})
        }),
        catchError(err => {
          console.warn(err);
          return EMPTY
        })
      );
    })
  );

  @Effect({ dispatch: false })
  readonly loginOrRegisterRequestSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.LoginActionSuccess, accountActions.RegisterActionSuccess),
    tap(() => {
      this.store.pipe(select(getNextRoute), first()).subscribe( route =>
      this.router.navigate([route])
      )
    })
  );

}
