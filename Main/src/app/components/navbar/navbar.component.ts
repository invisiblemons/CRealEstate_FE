import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from 'src/app/features/authen-page/local-storage.service';
import { Brand } from 'src/app/features/brand/brand.model';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { ShareDataService } from 'src/app/shared/services/share-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  user: Brand;
  avatar: string;
  name: string;
  lengthAppm: number;

  @Output() isLogin = new EventEmitter<Boolean>();

  constructor(
    private router: Router,
    private localStorageServices: LocalStorageService,
    private reloadService: ReloadRouteService,
    private shareDataServices: ShareDataService,
    private cd: ChangeDetectorRef
  ) {
    router.events.subscribe((val) => {
      this.isCollapsed = true;
    });
    this.lengthAppm = 0;
  }

  @HostListener('window:resize', ['$event'])
  mobileView() {
    if (window.innerWidth < 992) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.user = this.localStorageServices.getUserObject();
    if (this.user !== null) {
      this.user.avatarLink
        ? (this.avatar = this.user.avatarLink)
        : (this.avatar = 'assets/img/defaultAvatar.png');
      if (this.user.name) this.name = this.user.name;
    }
  }

  logout() {
    this.localStorageServices.removeUser();
    window.location.reload();
  }

  redirectToHome() {
    this.reloadService.routingReload('/trang-chu', null);
  }

  viewProfile() {
    this.reloadService.routingReload('/ho-so', null);
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
  routingAuthen() {
    this.reloadService.routingReload('/xac-thuc', null);
  }
  redirectToWishlist() {
    this.reloadService.routingReload('/yeu-thich', null);
  }
  redirectToContract() {
    this.reloadService.routingReload('/hop-dong', null);
  }
  redirectToSavedSearch() {
    this.reloadService.routingReload('/tim-kiem-da-luu', null);
  }
}
