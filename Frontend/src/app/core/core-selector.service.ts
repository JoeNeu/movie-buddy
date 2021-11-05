import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {getCurrentUserId, getCurrentUserToken} from "./+state/core.reducer";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoreSelectorService implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
  }

  getCurrentUserToken(): Observable<string> {
    return this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(getCurrentUserToken)
    )
  }

  getCurrentUserId(): Observable<string> {
    return this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(getCurrentUserId)
    )
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
