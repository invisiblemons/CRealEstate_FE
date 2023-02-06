import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerDetailComponent } from '../broker/broker-detail/broker-detail.component';
import { PropertyDetailComponent } from '../property/property-detail/property-detail.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentNewComponent } from './appointment-new/appointment-new.component';
import { AppointmentComponent } from './appointment.component';

const routes: Routes = [
  {
    path: "",
    component: AppointmentComponent,
    children: [
      {
        path: "",
        redirectTo: "danh-sach",
        pathMatch: "full"
      },
      {
        path: "danh-sach",
        component: AppointmentListComponent,
        children: [
          {
            path: "chinh-sua",
            component: AppointmentEditComponent
          },
          // {
          //   path: "mat-bang-chi-tiet",
          //   component: PropertyDetailComponent
          // }
        ]
      },
      {
        path: "tao-moi",
        component: AppointmentNewComponent,
        children: [
          {
            path: "mat-bang-chi-tiet",
            component: PropertyDetailComponent
          },
          {
            path: "chi-tiet-moi-gioi",
            component: BrokerDetailComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
