import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TABLE_CONFIG } from 'src/app/shared/constants/common.const';
import { Column } from 'src/app/shared/models/table.model';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Contract } from '../contract.model';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
})
export class ContractListComponent implements OnInit {
  destroySubs$: Subject<boolean> = new Subject<boolean>();

  TABLE_CONFIG = TABLE_CONFIG;

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

  first = 0;

  isShowSpin: boolean;

  loading: boolean;

  statuses: { label: string; value: number }[];

  selectedStatus: { label: string; value: number };

  //contract
  contract: Contract;

  contracts: Contract[] = [];

  selectedContracts: Contract[] = [];

  constructor(
    private contractServices: ContractService,
    private reloadServices: ReloadRouteService
  ) {
    this.isShowSpin = true;
    this.loading = false;
    this.statuses = [
      { label: "Đã xoá", value: 0 },
      { label: "Cần xác thực", value: 1 },
      { label: "Hoạt động", value: 2 },
    ];
    this.contracts = [];

    this.cols = [
      {
        field: 'no',
        header: 'STT',
        width: '5rem',
        disabled: true,
        visible: true,
        headerAlign: 'center',
        textAlign: 'center',
      },
      {
        field: 'startDate',
        header: 'Ngày bắt đầu',
        width: '12rem',
        disabled: true,
        visible: true,
        headerAlign: 'center',
        textAlign: 'center',
      },
      {
        field: 'endDate',
        header: 'Ngày kết thúc',
        width: '12rem',
        disabled: true,
        visible: true,
        headerAlign: 'center',
        textAlign: 'center',
      },
      {
        field: 'status',
        header: 'Trạng thái',
        width: '10rem',
        disabled: true,
        visible: true,
        headerAlign: 'center',
        textAlign: 'center',
      },
      {
        field: 'action',
        header: 'Xem chi tiết',
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
    this.contractServices.getContracts().subscribe((contracts) => {
      this.contracts = contracts;
      this.isShowSpin = false;
    });
  }

  // paging
  next() {
    this.first = this.first + this.TABLE_CONFIG.ROWS;
  }
  prev() {
    this.first = this.first - this.TABLE_CONFIG.ROWS;
  }
  reset() {
    this.first = 0;
  }
  isLastPage(): boolean {
    return this.contracts
      ? this.first === this.contracts.length - this.TABLE_CONFIG.ROWS
      : true;
  }
  isFirstPage(): boolean {
    return this.contracts ? this.first === 0 : true;
  }

  openDetailContract(contract) {
    this.reloadServices.routingNotReload(
      '/hop-dong/danh-sach/chi-tiet',
      contract.id
    );
  }
}
