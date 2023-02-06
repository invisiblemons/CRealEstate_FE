import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectService } from 'src/app/shared/services/project.service';
import { StreetSegment } from 'src/app/shared/models/streetSegment.model';
import { Ward } from 'src/app/shared/models/ward.model';
import { District } from 'src/app/shared/models/district.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { MenuItem } from 'primeng/api';
import swal from 'sweetalert2';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { ShareDataService } from 'src/app/shared/services/share-data.service';
import { WishlistService } from '../../wishlist/wishlist.service';
import { Wishlist } from '../../wishlist/wishlist.model';
import { Media } from 'src/app/shared/models/media.model';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Property } from '../../property/property.model';
import { PropertyService } from '../../property/property.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss'],
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  /*
  Fields of component
  */
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  isVisible: boolean;
  isShowSkeleton: boolean;
  items: MenuItem[];
  activeItem: MenuItem;
  currentMenuId = 'detail-body-1';
  isActiveHeart: boolean = false;

  /* 
  Fields of object
  */
  statuses: { label: string; value: number }[];
  property: Property;
  project: Project;
  detailLocation: string;
  street: StreetSegment;
  ward: Ward;
  district: District;
  projects: Project[];
  // direction
  directions: { label: string; value: number }[];
  selectedDirection: { label: string; value: number };

  isShowVerifyingDialog = false;

  isVerified: boolean = false;

  images: Media[] = [];
  certificateImages: Media[] = [];

  displayCustom: boolean;
  activeIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private propertyServices: PropertyService,
    private projectServices: ProjectService,
    private locationServices: LocationService,
    private router: Router,
    private localStorageServices: LocalStorageService,
    private shareDataServices: ShareDataService,
    private wishListService: WishlistService,
    private ref: ChangeDetectorRef,
    private reloadService: ReloadRouteService
  ) {
    this.isVisible = true;
    this.isShowSkeleton = true;

    // direction
    this.directions = [
      { label: 'Bắc', value: 0 },
      { label: 'Đông Bắc', value: 1 },
      { label: 'Đông', value: 2 },
      { label: 'Đông Nam', value: 3 },
      { label: 'Nam', value: 4 },
      { label: 'Tây Nam', value: 5 },
      { label: 'Tây', value: 6 },
      { label: 'Tây Bắc', value: 7 },
    ];
  }

  ngOnInit(): void {
    /* 
    get add new property into appointment
    */
    this.route.queryParams
      .pipe(
        takeUntil(this.destroySubs$),
        switchMap((params) => {
          return this.propertyServices.getPropertyById(params['id']);
        }),
        switchMap((property) => {
          this.locationServices
            .getWardById(property.location.wardId)
            .pipe(
              takeUntil(this.destroySubs$),
              switchMap((ward: Ward) => {
                this.ward = ward;
                //get street by id
                return this.locationServices.getStreetSegmentById(
                  property.location.streetSegment.id
                );
              }),
              switchMap((streetSegment: StreetSegment) => {
                this.street = streetSegment;
                //get district
                return this.locationServices.getDistrictById(
                  this.ward.districtId
                );
              })
            )
            .subscribe((district: District) => {
              this.district = district;
              //get address
              property.location.addressName =
                property.location.address +
                ', ' +
                this.street.name +
                ', ' +
                this.ward.name +
                ', ' +
                this.district.name;
            });
          this.property = property;

          this.property.media.forEach((image) => {
            if (image.type === 1) {
              this.images.push(image);
            } else if (image.type === 2) {
              this.certificateImages.push(image);
            }
          });

          return this.projectServices.getProjects();
        }),
        switchMap((projects) => {
          this.projects = projects;
          if (this.localStorageServices.getUserObject()) {
            if (this.localStorageServices.getUserObject().status === 2) {
              return this.wishListService.getWishlistById(
                this.property.id,
                this.localStorageServices.getUserObject().id
              );
            } else {
              return of(this.property);
            }
          } else {
            return of(this.property);
          }
        })
      )
      .subscribe((res) => {
        if (this.localStorageServices.getUserObject()) {
          if (this.localStorageServices.getUserObject().status === 2) {
            if (res.length > 0) {
              this.isActiveHeart = true;
            }
          }
        }
        this.property = this.updateProject(this.property);
        this.directions.forEach((direction) => {
          direction.value === this.property.direction
            ? (this.selectedDirection = direction)
            : '';
        });
        this.isShowSkeleton = false;
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  //data functions
  getProject(property: Property): Project {
    for (let i = 0; i < this.projects.length; i++) {
      if (property.projectId === this.projects[i].id) {
        return this.projects[i];
      }
    }
    return;
  }
  updateProject(property: Property): Property {
    let project = this.getProject(property);
    if (project) {
      property.project = project;
    }
    return property;
  }

  hide() {
    this.isVisible = false;
    this.reloadService.routingNotReload('/tim-kiem-nang-cao', null);
  }

  createAppointment() {
    if (this.localStorageServices.getUserObject()) {
      if (this.localStorageServices.getUserObject().status === 2) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/cuoc-hen/tao-moi'], {
          queryParams: { property: this.property.id, isFromProperty: true },
          skipLocationChange: true,
        });
      } else {
        this.isShowVerifyingDialog = true;
        this.isVerified = true;
      }
    } else {
      this.isShowVerifyingDialog = true;
      this.isVerified = false;
    }
  }

  addWishList(property) {
    if (this.localStorageServices.getUserObject()) {
      if (this.localStorageServices.getUserObject().status === 2) {
        this.wishListService
          .insertWishlist([property.id])
          .subscribe((wishListRes) => {
            this.isActiveHeart = true;
            property.isActiveHeart = true;
            this.shareDataServices.heartAfterAdding(property);
            swal.fire({
              title: 'Thành công!',
              text: 'Đã thêm vào danh sách yêu thích.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success animation-on-hover',
              },
              buttonsStyling: false,
              timer: 2000,
            });
          });
      } else {
        this.isShowVerifyingDialog = true;
        this.isVerified = true;
      }
    } else {
      this.isShowVerifyingDialog = true;
      this.isVerified = false;
    }
  }

  removeWishList(property) {
    if (this.localStorageServices.getUserObject()) {
      if (this.localStorageServices.getUserObject().status === 2) {
        
              this.wishListService
                .deleteWishlist([property.id])
                .subscribe((res) => {
                  this.isActiveHeart = false;
                  this.ref.detectChanges();
                  property.isActiveHeart = false;
                  this.shareDataServices.heartAfterAdding(property);
                  swal.fire({
                    title: 'Đã loại bỏ!',
                    text: 'Đã loại bỏ khỏi danh sách yêu thích.',
                    icon: 'success',
                    customClass: {
                      confirmButton: 'btn btn-success',
                    },
                    buttonsStyling: false,
                    timer: 2000,
                  });
                });
      } else {
        this.isShowVerifyingDialog = true;
        this.isVerified = true;
      }
    } else {
      this.isShowVerifyingDialog = true;
      this.isVerified = false;
    }
  }

  getStatusVerifyingDialog() {
    this.isShowVerifyingDialog = false;
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
