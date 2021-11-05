import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";

import * as accountActions from "./account.actions"
import {AccountService} from "../account.service";
import {combineLatest, EMPTY, Observable} from "rxjs";
import {Action, select, Store} from "@ngrx/store";
import {catchError, exhaustMap, first, map, switchMap, tap} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";
import {Router} from "@angular/router";
import {getNextRoute} from "../../core/+state/core.reducer";
import {CoreSelectorService} from "../../core/core-selector.service";


@Injectable(
)
export class AccountEffects {

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private coreSelectorService: CoreSelectorService,
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

  @Effect()
  readonly changePasswordRequest$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ChangePasswordAction),
    exhaustMap(({passwordChangeDto}) => {
      return this.coreSelectorService.getCurrentUserToken().pipe(
        switchMap((token: string) => {
          return this.accountService.changePassword(passwordChangeDto, token).pipe(
            map(() => {
              return accountActions.ChangePasswordActionSuccess({})
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
  readonly deleteAccountRequest$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.DeleteAccountAction),
    exhaustMap(() => {
      return combineLatest(
        this.coreSelectorService.getCurrentUserToken(),
        this.coreSelectorService.getCurrentUserId()
      ).pipe(
        switchMap(([token, id]) => {
          return this.accountService.deleteAccount(id, token).pipe(
            map(_ => {
              return accountActions.DeleteAccountActionSuccess({})
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

  @Effect({ dispatch: false })
  readonly requestSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.DeleteAccountActionSuccess),
    tap(() => {
      this.router.navigate([''])
    })
  );

}
