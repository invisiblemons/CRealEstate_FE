import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractComponent } from './contract.component';

const routes: Routes = [
  {
    path: '',
    component: ContractComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'danh-sach'
      },
      {
        path: 'danh-sach',
        component: ContractListComponent,
        children: [
          {
            path: 'chi-tiet',
            component: ContractDetailComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractRoutingModule {}
