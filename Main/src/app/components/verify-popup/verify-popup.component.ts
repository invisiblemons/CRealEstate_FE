import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { LocalStorageService } from 'src/app/features/authen-page/local-storage.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';

@Component({
  selector: 'app-verify-popup',
  templateUrl: './verify-popup.component.html',
  styleUrls: ['./verify-popup.component.scss'],
})
export class VerifyPopupComponent implements OnInit {
  name: string;
  isShowModal = true;
  @Output() hide = new EventEmitter();
  @Input() isVerified;
  constructor(private localStorageService: LocalStorageService, private reloadRouteService: ReloadRouteService) {}

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["isVerified"].currentValue) {
      this.isVerified = changes["isVerified"].currentValue;
      if(this.isVerified) {
        this.name = this.localStorageService.getUserObject().name;
      }
      this.isShowModal = true;
    }
  }

  hideDialog() {
    this.isShowModal = false;
    this.hide.emit();
    if(!this.isVerified) {
      this.reloadRouteService.routingReload('/xac-thuc', null);
    }
  }
}
