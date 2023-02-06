import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractRoutingModule } from './contract-routing.module';
import { ContractComponent } from './contract.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [ContractComponent, ContractListComponent, ContractDetailComponent],
  imports: [
    CommonModule,
    ContractRoutingModule,
    ComponentsModule
  ]
})
export class ContractModule { }
