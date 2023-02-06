import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerDetailComponent } from './broker-detail/broker-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chi-tiet',
  },
  {
    path: 'chi-tiet',
    component: BrokerDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokerRoutingModule {}
