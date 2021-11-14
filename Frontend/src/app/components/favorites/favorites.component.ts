import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../account/account.service';
import {VideoProductionModel} from '../../models/VideoProduction.model';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {FavoritesSelectorService} from './favorites-selector.service';
import {GetAllFavoritesAction} from './+state/favorites.actions';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  favorites: VideoProductionModel[];
  private unsubscribe$ = new Subject();

  constructor(
    private accountService: AccountService,
    private store: Store,
    private favoritesSelectorService: FavoritesSelectorService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(GetAllFavoritesAction());

    this.favoritesSelectorService.getAllFavoritesFromStore().toPromise().then((favorites) => {
      this.favorites = favorites;
    });

    // this.store.pipe(
    //   takeUntil(this.unsubscribe$),
    //   select(getCurrentUser),
    //   concatMap((account: AccountModel) => {
    //     return combineLatest(
    //       this.favoritesSelectorService.getAllFavoritesFromStore()
    //     )
    //   })
    // ).subscribe(([ favorites]: [ VideoProductionModel[]]) => {
    //     this.favorites = favorites;
    //   }
    // );
  }


}

