import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tv-show-detail',
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.scss']
})
export class TvShowDetailComponent implements OnInit {

  @Input() item;

  constructor() { }

  ngOnInit(): void {
  }

}
