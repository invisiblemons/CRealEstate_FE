import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyMapComponent } from './property-map/property-map.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyListTableComponent } from './property-list-table/property-list-table.component';

@NgModule({
  declarations: [
    PropertyComponent,
    PropertyListComponent,
    PropertyDetailComponent,
    PropertyMapComponent,
    PropertyListTableComponent,
  ],
  imports: [CommonModule, PropertyRoutingModule, ComponentsModule],
  exports: [PropertyListTableComponent,PropertyDetailComponent]
})
export class PropertyModule {}
