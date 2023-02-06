import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ReloadRouteService {
  constructor(private router: Router) {}

  public routingReload(url: string, id: any): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
    if(id) {
      this.router.navigate([url], {
        queryParams: { id: id }
      });
    } else {
      this.router.navigate([url]);
    }
  }
  public routingNotReload(url: string, id: any): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return true;
    };
    this.router.onSameUrlNavigation = 'reload';
    if(id) {
      this.router.navigate([url], {
        queryParams: { id: id },skipLocationChange: true
      });
    } else {
      this.router.navigate([url], {skipLocationChange: true});
    }
  }
}
