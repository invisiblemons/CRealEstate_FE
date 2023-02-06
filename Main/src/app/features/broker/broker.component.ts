import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Broker } from 'src/app/features/broker/broker.model';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.scss'],
})
export class BrokerComponent implements OnInit {
  @Input() broker: Broker;

  @Output() openBrokerDetail = new EventEmitter();
  constructor(private reloadService: ReloadRouteService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['broker'].currentValue) {
      this.broker = changes['broker'].currentValue;
    }
  }

  redirectoDetail() {
    this.openBrokerDetail.emit();
  }
}
