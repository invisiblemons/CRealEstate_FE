import { Injectable } from '@angular/core';
import {
  CanActivate, Router
} from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
  ) {}

  canActivate() {
    let token: string = this.localStorage.getUserToken();
    
    if (null !== token) {
      return true;
    }
    this.router.navigate(['/xac-thuc']);
    return false;
  }
}
