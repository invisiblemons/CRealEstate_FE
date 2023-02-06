import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  finalize,
  fromEvent,
  merge,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import { Store } from '../store.model';
import { StoreService } from '../store.service';
import swal from 'sweetalert2';
import { categories } from 'src/app/shared/constants/constants';
import { GeoLocation } from 'src/app/shared/models/types-map/GeoLocation/geolocation-class';
import { loader } from 'src/app/shared/constants/loader';
import { LocalStorageService } from '../../authen-page/local-storage.service';

@Component({
  selector: 'app-store-new',
  templateUrl: './store-new.component.html',
  styleUrls: ['./store-new.component.scss'],
})
export class StoreNewComponent implements OnInit {
  destroySubs$: Subject<boolean> = new Subject<boolean>();

  @Output() stateNewDialog = new EventEmitter();

  isShowSkeleton: boolean;

  isShowDialog: boolean;

  loading: boolean;

  store: Store = new Store(null, false);

  //validate
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errorMessage = '';

  storeForm!: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };

  private genericValidator: GenericValidator;

  // Autocomplete
  formatted_address: string;
  isAddressManuallyTyped: boolean;
  categories = categories;
  selectedCategories: any;
  selectedNameCategories: string[];

  autocompleteInput: string = '';
  queryWait: boolean;
  @ViewChild('addressText') addressText: any;
  filterValue = '';

  // Map Fields
  map: google.maps.Map;
  place: any;
  addressType: string = 'geocode';
  locationSearch: GeoLocation;

  isShowNameField: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reloadServices: ReloadRouteService,
    private storeService: StoreService,
    private zone: NgZone,
    private localStorageService: LocalStorageService
  ) {
    this.isAddressManuallyTyped = false;

    this.selectedCategories = [];
    this.selectedNameCategories = [];

    this.isShowDialog = true;
    this.isShowSkeleton = true;
    this.loading = false;

    //validate
    this.validationMessages = {
      address: {
        required: 'Địa chỉ không được để trống.',
      },
      name: {
        required: 'Tên cửa hàng không được để trống.',
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.storeForm = this.fb.group({
      address: ['', [Validators.required]],
    });
    this.isShowSkeleton = false;
  }

  ngAfterViewInit(): void {
    loader.load().then(() => {
      this.map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: {
            lat: 10.783645286871034,
            lng: 106.6956950392398,
          },
          zoom: 14,
        }
      );
    });

    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.storeForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.storeForm
        );
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  hideDialog() {
    this.storeForm.get('address').setValue("");
    this.stateNewDialog.emit(this.store);
  }

  format(value) {
    return `${value}`;
  }
  onKeyAddress($event: Event): void {
    this.autocompleteInput = ($event.target as HTMLInputElement).value;
    this.isAddressManuallyTyped = true;
    const ac = new google.maps.places.Autocomplete(
      this.addressText.nativeElement,
      {
        componentRestrictions: { country: 'VN' },
        types: [this.addressType], // 'establishment' / 'address' / 'geocode'
      }
    );
    google.maps.event.addListener(ac, 'place_changed', () => {
      // excute find property on that place
      this.place = ac.getPlace();
      this.store.address = this.place.formatted_address;
      this.isShowNameField = true;
      this.storeForm.addControl('name', new FormControl('', Validators.required));
      this.storeForm.get('name').setValue(this.place.name);
    });
  }

  saveStore() {
    this.loading = true;
    this.store.name = this.storeForm.get('name').value;
    this.store.brandId = this.localStorageService.getUserObject().id;
    this.storeService
      .insertStore(this.store)
      .pipe(
        takeUntil(this.destroySubs$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (store) => {
          //get store
          this.store = store;
          swal.fire({
            title: 'Thành công!',
            text: 'Tạo mới cửa hàng thành công.',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-success animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
          this.storeForm.reset();
          this.hideDialog();
        },
        error: (error) => {
          swal.fire({
            title: 'Thất bại!',
            text: 'Tạo mới cửa hàng thất bại.',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-info animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
        },
      });
  }
}
