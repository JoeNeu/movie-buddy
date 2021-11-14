import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {VideoProductionModel} from '../../../models/VideoProduction.model';
import {AddToFavoritesAction} from '../../favorites/+state/favorites.actions';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  @Input() movie; // With Type does some problems

  constructor(
    private store: Store,
  ) {
  }

  ngOnInit(): void {
  }

  addToFavorites(movie) {
    const videoProduction: VideoProductionModel = {
      movieId: movie.id,
      productionType: movie.name ? 'TVSHOW' : 'MOVIE'
    };
    this.store.dispatch(AddToFavoritesAction({videoProduction}));
  }

}
