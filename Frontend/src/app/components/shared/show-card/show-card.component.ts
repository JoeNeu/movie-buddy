import {Component, Input, OnInit} from '@angular/core';
import {tmdbTvShow} from "../../../models/the-movie-db.model";

@Component({
  selector: 'app-show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.scss']
})
export class ShowCardComponent implements OnInit {
  @Input() show: tmdbTvShow

  constructor() { }

  ngOnInit(): void {
  }

}
