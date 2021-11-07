import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountModel} from "../../models/account.model";
import {select, Store} from "@ngrx/store";
import {GetAllAccountsAction} from "../../account/+state/account.actions";
import {combineLatest, Subject, zip} from "rxjs";
import {AccountSelectorService} from "../../account/account-selector.service";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {concatMap, switchMap, takeUntil} from "rxjs/operators";
import {getCurrentUser} from "../../core/+state/core.reducer";
import {AddFriendAction, DeleteFriendAction} from "../../social/+state/social.actions";
import {SocialSelectorService} from "../../social/social-selector.service";

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit, AfterViewInit, OnDestroy {

  allAccounts: AccountModel[];
  friendsAccounts: AccountModel[];
  private unsubscribe$ = new Subject();
  @ViewChild('tabGroup', {static: false}) tabGroup;
  private currentTab: number;
  searchTextUser: string;
  searchTextFriend: string;

  displayedColumns: string[] = ['position', 'username', 'firstname', 'lastname'];

  constructor(
    private store: Store,
    private accountSelectorService: AccountSelectorService,
    private socialSelectorService: SocialSelectorService,
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(GetAllAccountsAction());
    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(getCurrentUser),
      concatMap((account: AccountModel) => {
        return combineLatest(
          this.accountSelectorService.getAllOtherAccountsFromStore(account.id),
          this.socialSelectorService.getAllFriendsFromStore()
        )
      })
    ).subscribe(([accounts, friends]: [AccountModel[], AccountModel[]]) => {
        console.log("f", friends)
        this.allAccounts = accounts.filter(account => !friends.map(friend => friend.id).includes(account.id));
        console.log("a", this.allAccounts)

        this.friendsAccounts = friends;
      }
    );
  }

  ngAfterViewInit() {
    this.currentTab = this.tabGroup.selectedIndex;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTab = tabChangeEvent.index;
  }

  addFriend(account: AccountModel) {
    this.store.dispatch(AddFriendAction({account}));
  }

  deleteFriend(account: AccountModel) {
    this.store.dispatch(DeleteFriendAction({id: account.id}));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
