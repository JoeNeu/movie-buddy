import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {first, switchMap} from 'rxjs/operators';
import {select, Store} from "@ngrx/store";
import {getCurrentUser} from "../core/+state/core.reducer";
import {AccountModel} from "../models/account.model";


@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuardService implements CanActivate {

  constructor(private store: Store,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.store
      .pipe(
        select(getCurrentUser),
        first(),
        switchMap((account: AccountModel) => {
          if (!account) {
            this.router.navigate(['/login'], { queryParams: { route: route.routeConfig.path } });
            return EMPTY;
          } else {
            return of(true);
          }
        }));
  }

}

