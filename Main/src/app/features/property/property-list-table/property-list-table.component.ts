import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Property } from '../property.model';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { Column } from 'src/app/shared/models/table.model';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { ShareDataService } from 'src/app/shared/services/share-data.service';

@Component({
  selector: 'app-property-list-table',
  templateUrl: './property-list-table.component.html',
  styleUrls: ['./property-list-table.component.scss'],
})
export class PropertyListTableComponent implements OnInit, OnDestroy {
  destroySubs$: Subject<boolean> = new Subject<boolean>();

  cols: Column[];

  _selectedColumns: Column[];

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter(
      (col: Column) => val.includes(col) || col.disabled
    );
  }

  isShowSpin: boolean;

  loading: boolean;

  /* 
  fields for object
  */
  //direction
  directions: { label: string; value: number }[];
  selectedDirection: { label: string; value: number };

  //property
  properties: Property[] = [];

  @Input() property: Property;
  @Input() isCanEdit: boolean;
  @Output() showedProperty = new EventEmitter<Property>();
  @Output() isDeleted = new EventEmitter();

  index: number;

  constructor(
    private localStorage: LocalStorageService,
    private reloadService: ReloadRouteService,
    private shareDataServices: ShareDataService
  ) {
    this.isShowSpin = true;
    this.loading = false;

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

  ngOnInit() {
    this.cols = [
      {
        field: 'no',
        header: 'STT',
        width: '5rem',
        layout: "nowrap",
        headerAlign: 'center',
        textAlign: 'center',
        visible: true,
        disabled: true,
      },
      {
        field: 'popImage',
        header: 'Hình ảnh',
        width: '15rem',
        layout: "nowrap",
        headerAlign: 'center',
        textAlign: 'center',
        visible: true,
        disabled: true,
      },
      {
        field: 'name',
        header: 'Tên BĐS TM',
        width: '20rem',
        layout: "unset",
        headerAlign: 'left',
        textAlign: 'left',
        visible: true,
        disabled: true,
      },
      {
        field: 'price',
        header: 'Giá cho thuê',
        width: '10rem',
        type: 'money',
        layout: "nowrap",
        headerAlign: 'right',
        textAlign: 'right',
        visible: true,
        disabled: true,
      },
      {
        field: 'action',
        header: 'Thao tác',
        width: '10rem',
        layout: "nowrap",
        headerAlign: 'center',
        textAlign: 'center',
        visible: this.isCanEdit ? true : false,
        disabled: this.isCanEdit ? true : false,
      },
    ];

    this.isShowSpin = false;
    this._selectedColumns = this.cols.filter((element) => element.visible);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isShowSpin = true;
    if (changes['property'].currentValue) {
      this.property = changes['property'].currentValue;
      let images = [];
      this.property.media.forEach((image) => {
        if (image.type === 1) {
          images.push(image);
        }
      });
      this.property.mainImage = images[0];
      this.properties.push(this.property);
      this.isShowSpin = false;
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  //data functions

  //table functions
  deleteProperty(property) {
    swal
      .fire({
        title: 'Bạn có chắc muốn xoá?',
        text: 'Bất động sản thương mại này sẽ bị xoá!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Không, giữ nguyên',
        confirmButtonText: 'Có, xoá nó!',
        customClass: {
          cancelButton: 'btn btn-default animation-on-hover',
          confirmButton: 'btn btn-danger animation-on-hover mr-1',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          this.properties = [];
          this.isDeleted.emit(true);
          swal.fire({
            title: 'Đã xoá!',
            text: 'Bất động sản thương mại đã xoá.',
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

  selectRow(property) {
    this.showedProperty.emit(property);
  }
}
