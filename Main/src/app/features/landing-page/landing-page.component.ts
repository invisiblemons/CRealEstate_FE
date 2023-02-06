import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { Brand } from '../brand/brand.model';

declare function js_background(): void;

@Component({
  selector: 'app-landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  isCollapsed = true;
  isCollapsed1 = true;
  isCollapsed2 = true;
  isCollapsed3 = true;
  isCollapsed4 = true;

  user: Brand;

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private reloadService: ReloadRouteService
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUserObject();
  }
  ngAfterViewInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    js_background();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
  }
  submitButton() {
    if (this.user) {
      this.reloadService.routingReload('/mat-bang-cho-thue', null);
    } else {
      this.reloadService.routingReload('/mat-bang', null);
    }
  }

  routingProperties() {
    if (this.user) {
      this.reloadService.routingReload('/mat-bang-cho-thue', null);
    } else {
      this.reloadService.routingReload('/mat-bang', null);
    }
  }

  routingRequest() {
    if (this.user) {
      this.reloadService.routingReload('/tim-kiem-nang-cao', null);
    } else {
      this.reloadService.routingReload('/xac-thuc', null);
    }
  }

  routingContract() {
    if (this.user) {
      this.reloadService.routingReload('/hop-dong/danh-sach', null);
    } else {
      this.reloadService.routingReload('/xac-thuc', null);
    }
  }
}
