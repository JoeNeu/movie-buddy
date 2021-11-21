import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import {MovieService} from "../../movies/movie.service";
import {tmdbModel} from "../../models/the-movie-db.model";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {MatAccordion} from "@angular/material/expansion";

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

  constructor(
    private route: ActivatedRoute, private movieService: MovieService
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
