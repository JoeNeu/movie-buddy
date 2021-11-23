import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {filter, find, first, map, takeUntil} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {MovieService} from "../../movies/movie.service";
import {tmdbModel} from "../../models/the-movie-db.model";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {MatAccordion} from "@angular/material/expansion";
import {VideoProductionModel} from "../../models/VideoProduction.model";
import {
  AddToFavoritesAction,
  GetAllFavoritesAction,
  RemoveFromFavoritesAction
} from "../favorites/+state/favorites.actions";
import {
  AddToWatchlistAction,
  GetAllWatchlistItemsAction,
  RemoveFromWatchlistAction
} from "../watchlist/+state/watchlist.actions";
import {MessageDialogComponent} from "../messages/message-dialog/message-dialog.component";
import {RatingModel} from "../../models/message.model";
import {createSelector, select, Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {SocialService} from "../../social/social.service";
import {getCurrentUser} from "../../core/+state/core.reducer";
import {AccountModel} from "../../models/account.model";
import * as fromRoot from "../../app.store";
import * as fromFavorites from "../favorites/+state/favorites.reducer";
import * as fromWatchlist from "../watchlist/+state/watchlist.reducer";
import {WatchlistSelectorService} from "../watchlist/watchlist-selector.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('tabGroup', {static: false}) tabGroup;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  private currentTab: number;

  item;
  isMovie: boolean = false;
  id;
  similarTabLabelName;
  itemSimilarSearchResult = [];
  private unsubscribe$ = new Subject();

  step = 0;
  isAlreadyFavorite: boolean;
  isAlreadyInWatchlist: boolean;
  rating: Observable<number>;
  loggedIn;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private store: Store,
    private router: Router,
    public dialog: MatDialog,
    private socialService: SocialService,
    private watchlistSelectorService: WatchlistSelectorService,
  ) {
    this.route.queryParams.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      /* tslint:disable:no-string-literal */
      this.id = params['id'];
      const movieFlag = params['isMovie'];
      this.isMovie = movieFlag ? movieFlag.toLowerCase() === 'true' : false;
      this.setLabelName();
      /* tslint:enable:no-string-literal */
    });
  }

  ngOnInit(): void {
    this.rating = this.socialService.getRating(+this.id).pipe(first(),
      map((val: RatingModel) => val.count)
    );

    this.store.select(getCurrentUser).pipe(takeUntil(this.unsubscribe$)).subscribe((user: AccountModel) => {
      if(user) {
        this.loggedIn = true;
        this.store.dispatch(GetAllWatchlistItemsAction());
        this.store.dispatch(GetAllFavoritesAction());

        this.store.pipe(
          takeUntil(this.unsubscribe$),
          select(createSelector(
            fromRoot.favoritesState, fromFavorites.getAllFavorites()
          ))
        ).subscribe((favorites: VideoProductionModel[]) => {
          this.isAlreadyFavorite = favorites.filter((fav: VideoProductionModel) => {
            return fav.movieId === +this.id;
          }).length > 0;
        });

        this.watchlistSelectorService.getWatchlistMovies().pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((watchlistItems: VideoProductionModel[]) => {
          this.isAlreadyInWatchlist = watchlistItems.filter((item: VideoProductionModel) => {
            return item.movieId === +this.id;
          }).length > 0;
        });
      }
    });

    if (this.isMovie === true){
      this.movieService.getMovieById(this.id).subscribe( movieDetails => {
        this.item = movieDetails;
      });
      this.movieService.getSimilarMoviesForId(this.id)
        .subscribe((data: tmdbModel) => {
            this.itemSimilarSearchResult = data.results.map((obj) => {
              return {
                ...obj,
                path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
              };
            });
          }
        );
    }
    else {
      this.movieService.getTvShowById(this.id).subscribe( tvShowDetails => {
        this.item = tvShowDetails;
        console.log(this.item.seasons);
      });
      this.movieService.getSimilarTvShowsForId(this.id)
        .subscribe((data: tmdbModel) => {
            this.itemSimilarSearchResult = data.results.map((obj) => {
              return {
                ...obj,
                path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
              };
            });
          }
        );
    }
  }

  private setLabelName(): void {
    if (this.isMovie){
      this.similarTabLabelName = 'Similar Movies';
    }
    else{
      this.similarTabLabelName = 'Similar TV Shows';
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTab = tabChangeEvent.index;
    console.log(this.currentTab);
  }

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  addToFavorites() {
    const productionType = this.getProductionType(this.item);

    const favorite: VideoProductionModel = {
      movieId: this.item.id,
      productionType,
      uid: productionType + this.item.id
    };

    if (this.isAlreadyFavorite) {
      this.store.dispatch(RemoveFromFavoritesAction({favorite}));
    } else {
      this.store.dispatch(AddToFavoritesAction({favorite}));
    }

    this.store.dispatch(GetAllFavoritesAction());
  }

  addToWatchlist() {
    const productionType = this.getProductionType(this.item);

    const favorite: VideoProductionModel = {
      movieId: this.item.id,
      productionType,
      uid: productionType + this.item.id
    };

    if (this.isAlreadyInWatchlist) {
      this.store.dispatch(RemoveFromWatchlistAction({favorite}));
    } else {
      this.store.dispatch(AddToWatchlistAction({favorite}));
    }

    this.store.dispatch(GetAllWatchlistItemsAction());
  }

  getProductionType(movie): string {
    return movie.name ? 'TVSHOW' : 'MOVIE';
  }

  shareWithFriends() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data: {
        movieId: this.item.id,
        type: this.getProductionType(this.item)
      }
    });
  }

  likeMovie() {
    this.rating = this.socialService.rateMovie(this.item.id).pipe(first(),
      map((val: RatingModel) => val.count)
    );
  }

  goToProfile() {
    this.router.navigate(['account']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
