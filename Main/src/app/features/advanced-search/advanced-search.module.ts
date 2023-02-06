import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancedSearchRoutingModule } from './advanced-search-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { AdvancedSearchComponent } from './advanced-search.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { StoreModule } from '../store/store.module';


@NgModule({
  declarations: [AdvancedSearchComponent, PropertyDetailComponent],
  imports: [
    CommonModule,
    AdvancedSearchRoutingModule,
    ComponentsModule,
    StoreModule
  ]
})
export class AdvancedSearchModule { }
