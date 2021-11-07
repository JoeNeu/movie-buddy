import {Component, Input, OnInit} from '@angular/core';
import {tmdbMovie} from "../../../models/the-movie-db.model";

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  @Input() movie: tmdbMovie

  constructor() { }

  ngOnInit(): void {
  }
}
