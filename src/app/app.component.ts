import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from './animations/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tkl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ slideInAnimation ]
})
export class AppComponent implements OnInit {
  public openDetails = false;
  public backgroundImage = 1;

  constructor() {
    setTimeout(() => {
      this.openDetails = true;
    }, 1500);
  }

  ngOnInit(): void {
    this.getRandomInt(15);
  }

  public getRandomInt(max): void {
    this.backgroundImage = Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  public prepareRoute(outlet: RouterOutlet): string {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
