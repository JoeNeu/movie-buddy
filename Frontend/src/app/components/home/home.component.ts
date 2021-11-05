import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public muted: boolean = true
  public randomVideo = [
    "https://vid.pr0gramm.com/2019/07/20/e228bff6488cedd8.mp4",
    "https://vid.pr0gramm.com/2020/10/01/3fc1daa84470c188.mp4",
    "https://vid.pr0gramm.com/2019/07/21/4f8f029532c5add1.mp4"
  ]
  public displayVideo;

  constructor(
  ) {
    this.displayVideo = this.randomVideo[Math.floor(Math.random()*this.randomVideo.length)]
  }

  ngOnInit(): void {
  }
}
