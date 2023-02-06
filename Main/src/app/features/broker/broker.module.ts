import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerComponent } from './broker.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { BrokerDetailComponent } from './broker-detail/broker-detail.component';
import { BrokerRoutingModule } from './broker-routing.module';



@NgModule({
  declarations: [BrokerComponent, BrokerDetailComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    BrokerRoutingModule
  ],
  exports: [BrokerComponent, BrokerDetailComponent]
})
export class BrokerModule { }
