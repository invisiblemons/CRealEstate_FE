import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize, of, Subject, switchMap, takeUntil } from 'rxjs';
import { District } from 'src/app/shared/models/district.model';
import { StreetSegment } from 'src/app/shared/models/streetSegment.model';
import { Ward } from 'src/app/shared/models/ward.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { Property } from '../property.model';
import { PropertyService } from '../property.service';
import swal from 'sweetalert2';
import { WishlistService } from '../../wishlist/wishlist.service';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { ShareDataService } from 'src/app/shared/services/share-data.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Brand } from '../../brand/brand.model';
import { BrandService } from '../../brand/brand.service';
import { DATE_FORMAT } from 'src/app/shared/constants/common.const';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss'],
})
export class PropertyListComponent implements OnInit, OnDestroy {
  DATE_FORMAT = DATE_FORMAT;
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  @Output() showDialog = new EventEmitter<Property>();
  @Output() showSpecificProperty = new EventEmitter<Property>();
  filterOptions: any;

  selectedFilter: any;

  properties: Property[];
  @Input() propertiesData: Property[];

  detailLocation: string;

  street: StreetSegment;

  ward: Ward;

  district: District;

  loading: boolean;

  minDate: Date = new Date();

  brand: Brand;

  isEmpty: boolean = false;

  @Input() isLoading: boolean;

  constructor(
    private propertyServices: PropertyService,
    private locationServices: LocationService,
    private wishListService: WishlistService,
    private ref: ChangeDetectorRef,
    private localStorageServices: LocalStorageService,
    private shareDataServices: ShareDataService,
    private reloadService: ReloadRouteService,
    private brandService: BrandService
  ) {
    this.minDate = new Date(this.minDate.setMonth(this.minDate.getMonth() - 1));
    this.filterOptions = [
      { name: 'Đề xuất', value: 'property-brand' },
      { name: 'Mới nhất', value: '?OrderBy=10' },
      { name: 'Cũ nhất', value: '?OrderBy=9' },
      { name: 'Giá cao đến thấp', value: '?OrderBy=50' },
      { name: 'Giá thấp đến cao', value: '?OrderBy=49' },
    ];
    this.selectedFilter = this.filterOptions[1];

    this.loading = true;
  }

  ngOnInit(): void {
    this.brand = this.localStorageServices.getUserObject();
    this.brandService.getBrandById(this.brand.id).subscribe((brand) => {
      this.localStorageServices.setUserObject(brand);
      this.brand = brand;
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['propertiesData'] && changes['propertiesData'].currentValue) {
      this.properties = changes['propertiesData'].currentValue;
      //get properties
      if (this.properties.length > 0) {
        this.properties.forEach((property, index) => {
          property.lastUpdateDate = new Date(property.lastUpdateDate);

          let images = [];
          property.media.forEach((image) => {
            if (image.type === 1) {
              images.push(image);
            }
          });
          property.mainImage = images[0];

          let wardTemp, streetSegmentTemp, districtTemp;

          this.locationServices
            .getWardById(property.location.wardId)
            .pipe(
              takeUntil(this.destroySubs$),
              switchMap((ward: Ward) => {
                wardTemp = ward;
                //get street by id
                return this.locationServices.getStreetSegmentById(
                  property.location.streetSegment.id
                );
              }),
              switchMap((streetSegment: StreetSegment) => {
                streetSegmentTemp = streetSegment;
                //get district
                return this.locationServices.getDistrictById(
                  wardTemp.districtId
                );
              }),
              switchMap((district: District) => {
                districtTemp = district;
                //get address
                property.location.addressName =
                  property.location.address +
                  ', ' +
                  streetSegmentTemp.name +
                  ', ' +
                  wardTemp.name +
                  ', ' +
                  districtTemp.name;
                if (this.localStorageServices.getUserObject()) {
                  // Get wishlist
                  return this.wishListService.getWishlistById(
                    property.id,
                    this.localStorageServices.getUserObject().id
                  );
                } else return of(property);
              })
            )
            .subscribe((res) => {
              if (this.localStorageServices.getUserObject()) {
                if (res.length > 0) {
                  if (res[0].type === 2 || res[0].type === 3) {
                    property.isActiveHeart = true;
                  }
                  property.type = res[0].type;
                }
                this.shareDataServices
                  .onHeartChange()
                  .subscribe((subjectRes) => {
                    property.isActiveHeart = subjectRes.property.isActiveHeart;
                  });
              }
              if (this.properties.length - 1 === index) {
                this.loading = false;
                this.isEmpty = false;
              }
            });
        });
      } else {
        this.properties = [];
        this.loading = false;
        this.isEmpty = true;
      }
    }
    if (changes['isLoading']) {
      this.loading = changes['isLoading'].currentValue;
    }
  }

  //load Data
  getPropertiesBySort() {
    if (this.selectedFilter.value === 'property-brand') {
      this.wishListService.getSuggests().subscribe((suggests) => {
        let properties = [];
        if (suggests.length > 0) {
          this.loading = true;
          suggests.forEach((suggest, index) => {
            let temp = this.properties.filter(
              (property) => suggest.propertyId === property.id
            )[0];
            this.properties = this.properties.filter(
              (property) => suggest.propertyId !== property.id
            );
            this.properties.unshift(temp);
          });
          this.loading = false;
        }
      });
    } else {
      this.propertyServices
        .getPropertiesWithSort(this.selectedFilter.value)
        .pipe(
          takeUntil(this.destroySubs$),
          switchMap((properties) => {
            this.getPropertyDetail(properties);

            return of(properties);
          })
        )
        .subscribe((properties) => {});
    }
  }

  getPropertyDetail(properties) {
    this.loading = true;
    if (properties.length > 0) {
      properties.forEach((property, index) => {
        property.lastUpdateDate = new Date(property.lastUpdateDate);
        let images = [];
        property.media.forEach((image) => {
          if (image.type === 1) {
            images.push(image);
          }
        });
        property.mainImage = images[0];
        let wardTemp, streetTemp, districtTemp;
        this.locationServices
          .getWardById(property.location.wardId)
          .pipe(
            takeUntil(this.destroySubs$),
            switchMap((ward: Ward) => {
              wardTemp = ward;
              //get street by id
              return this.locationServices.getStreetSegmentById(
                property.location.streetSegment.id
              );
            }),
            switchMap((streetSegment: StreetSegment) => {
              streetTemp = streetSegment;
              //get district
              return this.locationServices.getDistrictById(wardTemp.districtId);
            }),
            switchMap((district: District) => {
              districtTemp = district;
              //get address
              property.location.addressName =
                property.location.address +
                ', ' +
                streetTemp.name +
                ', ' +
                wardTemp.name +
                ', ' +
                districtTemp.name;
              if (this.localStorageServices.getUserObject()) {
                // Get wishlist
                return this.wishListService.getWishlistById(
                  property.id,
                  this.localStorageServices.getUserObject().id
                );
              } else return of(property);
            })
          )
          .subscribe((res) => {
            if (this.localStorageServices.getUserObject()) {
              if (res.length > 0) {
                property.isActiveHeart = true;
                property.type = res[0].type;
              }
              this.shareDataServices.onHeartChange().subscribe((subjectRes) => {
                property.isActiveHeart = subjectRes.property.isActiveHeart;
              });
            }
            if (properties.length - 1 === index) {
              this.loading = false;
              this.isEmpty = false;
              let temps = [];
              properties.forEach((propertyWillShow) => {
                this.properties.forEach((propertyInRoot) => {
                  if (propertyInRoot.id === propertyWillShow.id) {
                    temps.push(propertyInRoot);
                  }
                });
              });
              this.properties = temps;
            }
          });
      });
    } else {
      this.loading = false;
    }
  }
  viewPropertyDetail(property) {
    this.showDialog.emit(property);
  }

  addWishList(property) {
    this.wishListService
      .insertWishlist([property.id])
      .subscribe((wishListRes) => {
        property.isActiveHeart = true;
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
  }

  removeWishList(property) {
    this.wishListService.deleteWishlist([property.id]).subscribe((res) => {
      property.isActiveHeart = false;
      this.ref.detectChanges();
      swal.fire({
        title: 'Loại bỏ thành công!',
        text: 'Đã loại bỏ khỏi danh sách yêu thích.',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-success',
        },
        buttonsStyling: false,
        timer: 2000,
      });
    });
  }

  showSpecific(event, property) {
    this.showSpecificProperty.emit(property);
  }
}
