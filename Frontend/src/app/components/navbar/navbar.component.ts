import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatSidenav} from "@angular/material/sidenav";
import {Observable} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('drawer') sidenav: MatSidenav;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("start")

    setTimeout(() => {
      console.log("done")
      this.sidenav.toggle()
    }, 1000)
  }

  infoButton() {
    this.router.navigate(['info']);
  }

  messageButton() {
    this.router.navigate(['message']);
  }

  accountButton() {
    this.router.navigate(['account']);
  }
}
