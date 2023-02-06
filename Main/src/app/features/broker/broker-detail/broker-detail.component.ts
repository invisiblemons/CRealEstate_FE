import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { DATE_FORMAT } from 'src/app/shared/constants/common.const';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { Broker } from '../../broker/broker.model';
import { BrokerService } from '../../broker/broker.service';

@Component({
  selector: 'app-broker-detail-root',
  templateUrl: './broker-detail.component.html',
  styleUrls: ['./broker-detail.component.scss'],
})
export class BrokerDetailComponent implements OnInit {
  isShowSkeleton: boolean = true;
  DATE_FORMAT = DATE_FORMAT;
  destroySubs$: Subject<boolean> = new Subject<boolean>();

  @Input() broker: Broker;

  @Output() statusBrokerDialog = new EventEmitter();

  isShowModal = true;

  constructor(
    private brokerServices: BrokerService,
    private route: ActivatedRoute,
    private router: Router,
    private reloadService: ReloadRouteService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    // Load Data
    this.brokerServices
      .getBrokerById(this.broker.id)
      .pipe(takeUntil(this.destroySubs$))
      .subscribe((broker) => {
        this.broker = broker;
        this.isShowSkeleton = false;
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }
  hideDialog() {
    this.statusBrokerDialog.emit();
  }
}
