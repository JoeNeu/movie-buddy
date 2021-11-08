import {Component, Input, OnInit} from '@angular/core';
import {tmdbMovie, tmdbTvShow} from "../../../models/the-movie-db.model";

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  @Input() movie; // With Type does some problems

  constructor() { }

  ngOnInit(): void {
  }
}
