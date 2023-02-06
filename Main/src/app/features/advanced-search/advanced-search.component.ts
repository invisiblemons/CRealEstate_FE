import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import {
  debounceTime,
  fromEvent,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { District } from 'src/app/shared/models/district.model';
import { StreetSegment } from 'src/app/shared/models/streetSegment.model';
import { Ward } from 'src/app/shared/models/ward.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { Property } from '../property/property.model';
import { PropertyService } from '../property/property.service';
import { StoreService } from '../store/store.service';
import swal from 'sweetalert2';
import { WishlistService } from '../wishlist/wishlist.service';
import { ShareDataService } from 'src/app/shared/services/share-data.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { AdvancedSearchService } from './advanced-search.service';
import { Request } from '../saved-search/saved-search.model';
import { SavedSearchService } from '../saved-search/saved-search.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  isShowSkeleton: boolean = true;

  /* 
  slider
   */
  label: any;
  tooltip: any;
  tooltipEnabled: any;
  /* 
  fields for object
  */
  //prices
  isQuickPrice: boolean;
  rangePrice: number[] = [0, 10000];

  //areas
  rangeArea: number[] = [0, 10000];

  //direction
  directions: { label: string; value: number }[];
  selectedDirections: { label: string; value: number }[];
  /*
  Validate
  */
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errorMessage = '';

  requestForm!: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };

  private genericValidator: GenericValidator;

  isShowRequestDialog: boolean = false;

  properties: Property[];

  rawProperties: Property[];

  ward: Ward;

  street: StreetSegment;

  district: District;

  isShowVerifyingDialog = false;

  isVerified: boolean = false;

  isActiveHeart: boolean = false;

  startDate: Date = new Date();

  endDate: Date = new Date();

  frontageNumbers: { label; value }[];
  selectedfrontageNumber: { label; value };

  selectedDistrict: District;
  districts: District[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  requestdialog: boolean = false;

  request: Request = new Request();

  sumarySearchFields: {
    rangePrice: number[];
    rangeArea: number[];
    numberOfFrontage: number;
    minDate: Date;
    maxDate: Date;
  };

  isShowEndDate: boolean = false;

  loading: boolean = false;

  propertiesFromRequest: Property[] = [];

  selectedUpdateMethod = { label: 'Ngay khi có mặt bằng', value: 0 };

  updateMethods = [
    { label: 'Ngay khi có mặt bằng', value: 0 },
    { label: '7:00 sáng mỗi ngày', value: 1 },
  ];

  isDone: boolean = false;

  constructor(
    private propertyService: PropertyService,
    private storeService: StoreService,
    private fb: FormBuilder,
    private locationServices: LocationService,
    private localStorageServices: LocalStorageService,
    private router: Router,
    private wishListService: WishlistService,
    private shareDataServices: ShareDataService,
    private reloadService: ReloadRouteService,
    private advancedSearchService: AdvancedSearchService,
    private route: ActivatedRoute,
    private savedSearchService: SavedSearchService
  ) {
    this.sumarySearchFields = {
      numberOfFrontage: null,
      rangePrice: [],
      rangeArea: [],
      minDate: new Date(),
      maxDate: new Date(),
    };

    this.frontageNumbers = [
      { label: '1 mặt tiền', value: 1 },
      { label: '2 mặt tiền', value: 2 },
      { label: '3 mặt tiền', value: 3 },
    ];

    // validate
    this.validationMessages = {
      rejectMessage: {
        required: 'Lý do từ chối xét duyệt không được để trống.',
      },
    };
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

    //slider
    this.label = {
      visible: true,
      format: (value) => this.format(value),
      position: 'top',
    };
    this.tooltip = {
      enabled: true,
      format: (value) => this.format(value),
      showMode: 'always',
      position: 'bottom',
    };
    this.tooltipEnabled = {
      enabled: true,
    };

    //direction
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
    this.propertyService
      .getProperties()
      .pipe(
        takeUntil(this.destroySubs$),
        switchMap((properties) => {
          properties.forEach((property, index) => {
            let images = [];
            property.media.forEach((image) => {
              if (image.type === 1) {
                images.push(image);
              }
            });
            property.images = images;
            property.mainImage = images[0];
            this.directions.forEach((direction) => {
              direction.value === property.direction
                ? (property.directionName = direction.label)
                : '';
            });
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
                  this.shareDataServices
                    .onHeartChange()
                    .subscribe((subjectRes) => {
                      property.isActiveHeart =
                        subjectRes.property.isActiveHeart;
                    });
                }
                if (properties.length - 1 === index) {
                  this.rawProperties = properties;
                  this.route.queryParams.subscribe((params) => {
                    if (params.id) {
                      this.savedSearchService
                        .getSavedSearchById(params.id)
                        .subscribe((request: Request) => {
                          this.request = request;
                          this.rangePrice = [
                            request.minPrice / 1000000,
                            request.maxPrice / 1000000,
                          ];
                          this.rangeArea = [
                            request.minFloorArea,
                            request.maxFloorArea,
                          ];
                          this.frontageNumbers.forEach((frontageItem) => {
                            if (frontageItem.value === request.amountFrontage) {
                              this.selectedfrontageNumber = frontageItem;
                            }
                          });
                          this.districts.forEach((district) => {
                            if (district.name === request.area) {
                              this.selectedDistrict = district;
                            }
                          });
                          this.propertiesFromRequest = request.properties;

                          let propertiesTemp = [];
                          if (this.propertiesFromRequest.length === 0) {
                            this.properties = [];
                            this.isShowSkeleton = false;
                          } else {
                            this.rawProperties.forEach((property) => {
                              this.propertiesFromRequest.forEach(
                                (propertyInRequest) => {
                                  if (propertyInRequest.id === property.id) {
                                    propertiesTemp.push(property);
                                  }
                                }
                              );
                            });
                            this.properties = propertiesTemp;
                            this.isShowSkeleton = false;
                          }
                        });
                    } else {
                      this.properties = this.rawProperties;
                      this.isShowSkeleton = false;
                    }
                  });
                }
              });
          });
          return of(properties);
        }),
        switchMap((properties) => {
          return this.locationServices.getDistricts();
        })
      )
      .subscribe((districts) => {
        this.districts = districts;
      });

    // validate
    this.requestForm = this.fb.group({
      rejectMessage: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.requestForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.requestForm
        );
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  format(value) {
    return `${value}`;
  }

  handleValuePriceChange(value) {
    this.rangePrice = [value.start, value.end];
    this.sumarySearchFields.rangePrice = this.rangePrice;
    this.propertyService
      .getPropertiesWithFilterFromRequest(this.sumarySearchFields)
      .subscribe((properties) => {
        this.properties = this.getRawProperties(properties);
      });
  }

  handleValueAreaChange(value) {
    this.rangeArea = [value.start, value.end];
    this.sumarySearchFields.rangeArea = this.rangeArea;
    this.propertyService
      .getPropertiesWithFilterFromRequest(this.sumarySearchFields)
      .subscribe((properties) => {
        this.properties = this.getRawProperties(properties);
      });
  }

  openRequestDialog() {
    this.isShowRequestDialog = true;
  }

  hideRequestDialog() {
    this.isShowRequestDialog = false;
  }

  createAppointment(property) {
    if (this.localStorageServices.getUserObject()) {
      if (this.localStorageServices.getUserObject().status === 2) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/cuoc-hen/tao-moi'], {
          queryParams: { property: property.id, isFromProperty: true },
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
        this.wishListService.deleteWishlist([property.id]).subscribe((res) => {
          this.isActiveHeart = false;
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

  changeFrontage(event) {
    this.selectedfrontageNumber = event.value;
    this.sumarySearchFields.numberOfFrontage =
      this.selectedfrontageNumber.value;
    this.propertyService
      .getPropertiesWithFilterFromRequest(this.sumarySearchFields)
      .subscribe((properties) => {
        this.properties = this.getRawProperties(properties);
      });
  }

  onRemoveFrontage() {
    this.sumarySearchFields.numberOfFrontage = null;
    let termProperties = [];
    this.propertyService
      .getPropertiesWithFilterFromRequest(this.sumarySearchFields)
      .subscribe((properties) => {
        this.properties = this.getRawProperties(properties);
      });
  }

  changeDistrict(event) {
    if (event.value) {
      this.selectedDistrict = event.value;
      let termProperties = [];
      this.locationServices
        .getWards(this.selectedDistrict.id)
        .subscribe((wards) => {
          if (wards.length > 0) {
            wards.forEach((ward) => {
              this.locationServices
                .getLocationByWardId(ward.id)
                .subscribe((locations) => {
                  if (locations.length > 0) {
                    locations.forEach((location, index) => {
                      this.propertyService
                        .getPropertiesWithLocationId(location.id)
                        .subscribe((properties) => {
                          properties.forEach((item) => {
                            termProperties = [...termProperties, item];
                          });

                          if (locations.length - 1 === index) {
                            let results = [];
                            termProperties.forEach((propertyItemRaw, i) => {
                              this.propertyService
                                .getPropertiesWithFilterFromRequest(
                                  this.sumarySearchFields
                                )
                                .subscribe((propertiesSumany) => {
                                  propertiesSumany.forEach((showedProperty) => {
                                    if (
                                      showedProperty.id === propertyItemRaw.id
                                    ) {
                                      this.rawProperties.forEach(
                                        (fullProperty) => {
                                          if (
                                            fullProperty.id ===
                                            propertyItemRaw.id
                                          ) {
                                            results.push(fullProperty);
                                          }
                                        }
                                      );
                                    }
                                  });
                                  if (termProperties.length - 1 === i) {
                                    this.properties = results;
                                  }
                                });
                            });
                            this.properties = results;
                          }
                        });
                    });
                  } else {
                    this.properties = [];
                  }
                });
            });
          } else {
            this.properties = [];
          }
        });
    }
  }

  onRemoveDistrict() {
    let termProperties = [];
    this.propertyService
      .getPropertiesWithFilterFromRequest(this.sumarySearchFields)
      .subscribe((properties) => {
        this.properties = this.getRawProperties(properties);
      });
  }

  openPropertyDetail(property) {
    this.reloadService.routingNotReload(
      '/tim-kiem-nang-cao/chi-tiet-mat-bang',
      property.id
    );
  }

  getDistrict(district) {
    if (district) {
      let termProperties = [];
      this.locationServices
        .getDistrictsWithFilter(district)
        .subscribe((districts) => {
          if (districts.length > 0) {
            this.locationServices
              .getWards(districts[0].id)
              .subscribe((wards) => {
                wards.forEach((ward) => {
                  this.locationServices
                    .getLocationByWardId(ward.id)
                    .subscribe((locations) => {
                      if (locations.length > 0) {
                        locations.forEach((location, index) => {
                          this.propertyService
                            .getPropertiesWithLocationId(location.id)
                            .subscribe((properties) => {
                              properties.forEach((item) => {
                                termProperties = [...termProperties, item];
                              });

                              if (locations.length - 1 === index) {
                                let results = [];
                                termProperties.forEach((propertyItemRaw, i) => {
                                  this.propertyService
                                    .getPropertiesWithFilterFromRequest(
                                      this.sumarySearchFields
                                    )
                                    .subscribe((propertiesSumany) => {
                                      propertiesSumany.forEach(
                                        (showedProperty) => {
                                          if (
                                            showedProperty.id ===
                                            propertyItemRaw.id
                                          ) {
                                            this.rawProperties.forEach(
                                              (fullProperty) => {
                                                if (
                                                  fullProperty.id ===
                                                  propertyItemRaw.id
                                                ) {
                                                  results.push(fullProperty);
                                                }
                                              }
                                            );
                                          }
                                        }
                                      );
                                      if (termProperties.length - 1 === i) {
                                        this.properties = results;
                                      }
                                    });
                                });
                              }
                            });
                        });
                      } else {
                        this.properties = [];
                      }
                    });
                });
              });
          }
        });
    } else {
      let termProperties = [];
      this.propertyService
        .getPropertiesWithFilterFromRequest(this.sumarySearchFields)
        .subscribe((properties) => {
          this.properties = this.getRawProperties(properties);
        });
    }
  }

  getRawProperties(properties) {
    let termProperties = [];
    properties.forEach((property) => {
      this.rawProperties.forEach((propertyItemRaw) => {
        if (property.id === propertyItemRaw.id) {
          if (this.selectedDistrict) {
            this.properties.forEach((propertyCurrent) => {
              if (propertyCurrent.id === propertyItemRaw.id) {
                termProperties.push(propertyItemRaw);
              }
            });
          } else {
            termProperties.push(propertyItemRaw);
          }
        }
      });
    });
    return termProperties;
  }

  createRequest() {
    this.loading = true;
    this.request.status = 1;
    this.request.amount = this.selectedUpdateMethod.value;
    this.request.brandId = this.localStorageServices.getUserObject().id;
    if (this.selectedfrontageNumber) {
      this.request.amountFrontage = this.selectedfrontageNumber.value;
    }
    if (this.selectedDistrict) {
      this.request.area = this.selectedDistrict.name;
    }
    if (this.rangeArea) {
      this.request.maxFloorArea = this.rangeArea[1];
      this.request.minFloorArea = this.rangeArea[0];
    }
    if (this.rangePrice) {
      this.request.maxPrice = this.rangePrice[1] * 1000000;
      this.request.minPrice = this.rangePrice[0] * 1000000;
    }
    this.advancedSearchService
      .insertRequest(this.request)
      .subscribe((request) => {
        this.hideRequestDialog();
        swal.fire({
          title: 'Thành công!',
          text: 'Đã lưu yêu cầu, chúng tôi sẽ liên hệ với bạn ngay khi có mặt bằng phù hợp.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success animation-on-hover',
          },
          buttonsStyling: false,
          timer: 3000,
        });
        this.isDone = true;
      });
  }

  changeUpdateMethod(event) {
    this.selectedUpdateMethod = event.value;
  }
}
