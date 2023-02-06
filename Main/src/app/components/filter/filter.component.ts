import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { categories } from 'src/app/shared/constants/constants';
interface Country {
  name: string;
  code: string;
}
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  formatted_address: string;
  isAddressManuallyTyped: boolean;
  categories = categories;
  selectedCategories: any;
  selectedNameCategories: string[];
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
  quickRangePrice: { label: string; value: number[] };
  rangePrice: number[] = [0, 10000];
  quickRangePrices = [
    { label: 'Dưới 10 triệu', value: [0, 10] },
    { label: 'Từ 10 - 50 triệu', value: [10, 50] },
    { label: 'Từ 50 - 100 triệu', value: [50, 100] },
    { label: 'Từ 100 - 200 triệu', value: [100, 200] },
    { label: 'Từ 200 - 500 triệu', value: [200, 500] },
    { label: 'Trên 500 triệu', value: [500, 10000] },
  ];
  //areas
  isQuickArea: boolean;
  quickRangeArea: { label: string; value: number[] };
  rangeArea: number[] = [0, 10000];
  quickRangeAreas = [
    { label: 'Dưới 50 m²', value: [0, 50] },
    { label: 'Từ 50 - 100 m²', value: [50, 100] },
    { label: 'Từ 100 - 200 m²', value: [100, 200] },
    { label: 'Từ 200 - 500 m²', value: [200, 500] },
    { label: 'Trên 500 m²', value: [500, 10000] },
  ];
  //direction
  directions: { label: string; value: number }[];
  selectedDirections: { label: string; value: number }[];
  //floor
  floors: { label: string; value: number }[];
  selectedFloors: { label: string; value: number }[];

  @Output() getPlaces = new EventEmitter();
  @Output() getAllProperties = new EventEmitter();
  @Output() searchFields = new EventEmitter();
  sumarySearchFields: {
    selectedCategories: { id: number; name: string }[];
    rangePrice: number[];
    rangeArea: number[];
    selectedDirections: { label: string; value: number }[];
    selectedFloors: { label: string; value: number }[];
  };
  //form autocomplete
  autocompleteInput: string = null;
  queryWait: boolean;
  @ViewChild('addressText') addressText: any;
  @Output() autocomplete = new EventEmitter();
  filterValue = '';

  debounce:any;

  constructor(private ref: ChangeDetectorRef) {
    this.isAddressManuallyTyped = false;

    this.selectedCategories = [];
    this.selectedNameCategories = [];
    // this.selectedCategories.push(categoryDefault);
    // this.selectedCategories.forEach((item) => {
    //   this.selectedNameCategories.push(item.name);
    // });

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

    this.floors = [
      { label: '1 tầng', value: 1 },
      { label: '2 tầng', value: 2 },
      { label: '3 tầng', value: 3 },
      { label: '4 tầng', value: 4 },
      { label: '5 tầng', value: 5 },
      { label: '6+ tầng', value: 6 },
    ];

    this.sumarySearchFields = {
      selectedCategories: [],
      rangePrice: [],
      rangeArea: [],
      selectedDirections: [],
      selectedFloors: [],
    };
  }

  ngOnInit(): void {}

  format(value) {
    return `${value}`;
  }

  searchPlaces(): void {
    if (this.autocompleteInput.length > 0) {
      this.autocomplete.emit();
    } else {
      this.getAllProperties.emit();
    }
  }
  onKeyAddress($event: Event): void {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(  () => {
      this.autocompleteInput = ($event.target as HTMLInputElement).value;
      this.autocomplete.emit();
      this.isAddressManuallyTyped = true;
    }, 200);
    
  }

  selectQuickRangePrice(value) {
    this.quickRangePrice = value;
    if (this.quickRangePrice.value[0] === 500) {
      this.sumarySearchFields.rangePrice = [500, 10000];
    } else {
      this.sumarySearchFields.rangePrice = this.quickRangePrice.value;
    }
    this.searchFields.emit(this.sumarySearchFields);
    this.isQuickPrice = true;
  }

  selectQuickRangeArea(value) {
    this.quickRangeArea = value;
    if (this.quickRangeArea.value[0] === 500) {
      this.sumarySearchFields.rangeArea = [500, 10000];
    } else {
      this.sumarySearchFields.rangeArea = this.quickRangeArea.value;
    }
    this.searchFields.emit(this.sumarySearchFields);
    this.isQuickArea = true;
  }

  handleValuePriceChange(value) {
    this.rangePrice = [value.start, value.end];
    this.isQuickPrice = false;
  }

  handleValueAreaChange(value) {
    this.rangeArea = [value.start, value.end];
    this.isQuickArea = false;
  }

  resetPrice() {
    this.isQuickPrice = undefined;
    this.quickRangePrice = undefined;
    this.sumarySearchFields.rangePrice = [0, 10000];
    this.searchFields.emit(this.sumarySearchFields);
  }

  resetArea() {
    this.isQuickArea = undefined;
    this.quickRangeArea = undefined;
    this.sumarySearchFields.rangeArea = [0, 10000];
    this.searchFields.emit(this.sumarySearchFields);
  }

  resetExtra() {
    this.selectedDirections = [];
    this.selectedFloors = [];
    this.sumarySearchFields.selectedFloors = [];
    this.sumarySearchFields.selectedDirections = [];
    this.searchFields.emit(this.sumarySearchFields);
  }

  selectIndustries(ev) {
    this.selectedNameCategories = [];
    ev.value.forEach((item) => {
      this.selectedNameCategories.push(item.name);
    });
    this.sumarySearchFields.selectedCategories = this.selectedCategories;
    this.searchFields.emit(this.sumarySearchFields);
  }
  filterPrice(price) {
    price.hide();
    this.sumarySearchFields.rangePrice = this.rangePrice;
    this.searchFields.emit(this.sumarySearchFields);
  }
  filterArea(area) {
    area.hide();
    this.sumarySearchFields.rangeArea = this.rangeArea;
    this.searchFields.emit(this.sumarySearchFields);
  }
  filterExtra(extra) {
    extra.hide();
    this.sumarySearchFields.selectedFloors = this.selectedFloors;
    this.sumarySearchFields.selectedDirections = this.selectedDirections;
    this.searchFields.emit(this.sumarySearchFields);
  }
}
