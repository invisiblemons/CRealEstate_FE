import {
  AfterViewInit,
  Component,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { Column } from 'src/app/shared/models/table.model';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Store } from '../store.model';
import { StoreService } from '../store.service';
import swal from 'sweetalert2';
import { GeoLocation } from 'src/app/shared/models/types-map/GeoLocation/geolocation-class';
import { loader } from 'src/app/shared/constants/loader';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
})
export class StoreListComponent implements OnInit, AfterViewInit {
  isShowSpin: boolean = true;

  cols: Column[];

  displayCols: Column[];

  _selectedColumns: Column[];

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter(
      (col: Column) => val.includes(col) || col.disabled
    );
  }

  stores: Store[];
  store: Store;
  selectedStore: Store;

  isShowNewDialog: boolean = false;

  isShowEditDialog: boolean = false;

  // Map Fields
  map: google.maps.Map;
  place: any;
  addressType: string = 'geocode';
  locationSearch: GeoLocation;

  @Output() district = new EventEmitter();

  constructor(
    private storeService: StoreService,
    private reloadServices: ReloadRouteService,
    private zone: NgZone,
    private mapService: MapService
  ) {
    this.cols = [
      {
        field: 'id',
        header: 'ID',
        width: '12rem',
        disabled: false,
        visible: false,
        headerAlign: 'left',
        textAlign: 'left',
      },
      {
        field: 'name',
        header: 'Tên',
        width: '12rem',
        disabled: true,
        visible: true,
        headerAlign: 'left',
        textAlign: 'left',
      },
      {
        field: 'address',
        header: 'Địa chỉ',
        width: '12rem',
        disabled: true,
        visible: true,
        headerAlign: 'left',
        textAlign: 'left',
      },
      {
        field: 'action',
        header: 'Thao tác',
        width: '15rem',
        disabled: true,
        visible: true,
        headerAlign: 'center',
        textAlign: 'center',
      },
    ];
    this.displayCols = this.cols.filter((element) => !element.disabled);
    this._selectedColumns = this.cols.filter((element) => element.visible);
  }

  ngOnInit(): void {
    this.storeService.getStores().subscribe((stores) => {
      this.stores = stores;
      this.isShowSpin = false;
    });
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
  }

  openNewStore() {
    this.isShowNewDialog = true;
  }

  getStateNewDialog(value) {
    if (value&&value.id) {
      this.stores.unshift(value);
    }
    this.isShowNewDialog = false;
  }
  onRowSelect(event) {
    let request = {
      query: event.data.address,
      fields: ['place_id'],
    };
    let service = new google.maps.places.PlacesService(this.map);
    service.findPlaceFromQuery(request, (results, status) =>
      this.zone.run(() => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let requestDetail = {
            placeId: results[0].place_id,
          };
          service.getDetails(requestDetail, (detailResults, statusOfDetail) =>
            this.zone.run(() => {
              if (
                statusOfDetail === google.maps.places.PlacesServiceStatus.OK
              ) {
                this.district.emit(this.mapService.getDistrict(detailResults));
              }
            })
          );
        }
      })
    );
  }

  onRowUnselect(event) {
    this.district.emit(null);
  }

  deleteStore(store) {
    swal
      .fire({
        title: 'Bạn có chắc muốn xoá?',
        text: 'Cửa hàng này sẽ bị xoá!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, xoá nó!',
        cancelButtonText: 'Không, giữ nguyên',
        customClass: {
          confirmButton: 'btn btn-danger animation-on-hover mr-1',
          cancelButton: 'btn btn-default animation-on-hover',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          this.storeService.deleteStore(store.id).subscribe((res) => {
            if (res) {
              this.stores = this.stores.filter(
                (storeItem) => storeItem.id !== store.id
              );
              swal.fire({
                title: 'Xoá thành công!',
                text: 'Đã xoá cửa hàng.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-success animation-on-hover',
                },
                buttonsStyling: false,
                timer: 2000,
              });
            }
          });
        }
      });
  }
}
