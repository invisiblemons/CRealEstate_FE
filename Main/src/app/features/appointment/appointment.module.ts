import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentComponent } from './appointment.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { AppointmentNewComponent } from './appointment-new/appointment-new.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { BrokerModule } from '../broker/broker.module';
import { PropertyModule } from '../property/property.module';
import { BrokerDetailComponent } from './broker-detail/broker-detail.component';

@NgModule({
  declarations: [
    AppointmentComponent,
    AppointmentListComponent,
    AppointmentEditComponent,
    AppointmentNewComponent,
    AppointmentDetailComponent,
    BrokerDetailComponent
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    ComponentsModule,
    BrokerModule,
    PropertyModule,
  ],
})
export class AppointmentModule {}
