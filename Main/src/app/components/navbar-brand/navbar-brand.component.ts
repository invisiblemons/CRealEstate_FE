import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AppointmentService } from 'src/app/features/appointment/appointment.service';
import { LocalStorageService } from 'src/app/features/authen-page/local-storage.service';
import { Brand } from 'src/app/features/brand/brand.model';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { ShareDataService } from 'src/app/shared/services/share-data.service';

@Component({
  selector: 'app-navbar-brand',
  templateUrl: './navbar-brand.component.html',
  styleUrls: ['./navbar-brand.component.scss'],
})
export class NavbarBrandComponent implements OnInit, OnDestroy {
  isAlive = true;
  lengthAppm: string;
  isCollapsed = true;
  user: Brand;
  avatar: string;
  name: string;

  constructor(
    private router: Router,
    private localStorageServices: LocalStorageService,
    private reloadService: ReloadRouteService,
    private shareDataServices: ShareDataService
  ) {
    router.events.subscribe((val) => {
      this.isCollapsed = true;
    });
  }
  ngOnInit() {
    this.user = this.localStorageServices.getUserObject();
    if (this.user !== null) {
      this.user.avatarLink
        ? (this.avatar = this.user.avatarLink)
        : (this.avatar = 'assets/img/Tim.png');
      if (this.user.name) this.name = this.user.name;
    }
  }
  ngOnDestroy() { 
    this.isAlive = false;
  }

  @HostListener('window:resize', ['$event'])
  mobileView() {
    if (window.innerWidth < 992) {
      return true;
    }
    return false;
  }

  logout() {
    this.localStorageServices.removeUser();
    this.reloadService.routingReload('/trang-chu', null);
  }
  redirectToHome() {
    this.reloadService.routingReload('/trang-chu', null);
  }
  redirectToProperty() {
    if (this.user) {
      this.reloadService.routingReload('/mat-bang-cho-thue', null);
    } else {
      this.reloadService.routingReload('/mat-bang', null);
    }
  }
  redirectToAdvancedSearch() {
    if (this.user) {
      this.reloadService.routingReload('/tim-kiem-nang-cao', null);
    }
  }
  redirectToAppointment() {
    this.reloadService.routingReload('/cuoc-hen/danh-sach', null);
  }
  redirectToNewAppointment() {
    this.reloadService.routingReload('/cuoc-hen/tao-moi', null);
  }
  routingLogin() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/xac-thuc'], {
        queryParams: { isLogin: true },
      });
  }
  routingSignUp() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/xac-thuc'], {
        queryParams: { isSignUp: true },
      });
  }
  viewProfile() {
    this.reloadService.routingReload('/ho-so', null);
  }
  redirectToWishlist() {
    this.reloadService.routingReload('/yeu-thich', null);
  }
  redirectToContract() {
    this.reloadService.routingReload('/hop-dong', null);
  }
  routingAuthen() {
    this.reloadService.routingReload('/xac-thuc', null);
  }
  redirectToSavedSearch() {
    this.reloadService.routingReload('/tim-kiem-da-luu', null);
  }
}
