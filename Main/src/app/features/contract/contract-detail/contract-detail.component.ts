import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { DATE_FORMAT } from 'src/app/shared/constants/common.const';
import { Media } from 'src/app/shared/models/media.model';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Contract } from '../contract.model';
import { ContractService } from '../contract.service';
import * as FileSaver from "file-saver";

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
})
export class ContractDetailComponent implements OnInit, OnDestroy {
  destroySubs$: Subject<boolean> = new Subject<boolean>();

  DATE_FORMAT = DATE_FORMAT;

  isShowSkeleton: boolean;

  isShowDialog: boolean;

  statuses: { label: string; value: number }[];

  contract: Contract;

  media: Media[];

  constructor(
    private route: ActivatedRoute,
    private contractServices: ContractService,
    private reloadServices: ReloadRouteService
  ) {
    this.isShowDialog = true;
    this.isShowSkeleton = true;
    this.statuses = [
      { label: "Đã xoá", value: 0 },
      { label: "Cần xác thực", value: 1 },
      { label: "Hoạt động", value: 2 },
    ];
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroySubs$),
        switchMap((params) => {
          return this.contractServices.getContractById(params['id']);
        }),
      )
      .subscribe((contract) => {
        this.contract = contract;
        this.media = this.contract.media;
        this.isShowSkeleton = false;
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  hideDialog() {
    this.reloadServices.routingReload('/hop-dong/danh-sach', null);
  }

  
  downTemplate() {
    this.contractServices
      .downFile(this.contract.id)
      .subscribe((response: any) => {
        const data: Blob = new Blob([response]);
        FileSaver.saveAs(data, "hop-dong.doc");
      });
  }
}
