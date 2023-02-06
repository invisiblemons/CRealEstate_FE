import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class MainAuthGuardService implements CanActivate {
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private reloadRouteService: ReloadRouteService
  ) {}

  canActivate() {
    let token: string = this.localStorage.getUserToken();

    if (null !== token) {
      if (this.localStorage.getUserObject().status === 2) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
}
