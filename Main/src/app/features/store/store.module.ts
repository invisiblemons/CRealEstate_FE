import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { StoreComponent } from './store.component';
import { StoreListComponent } from './store-list/store-list.component';
import { StoreNewComponent } from './store-new/store-new.component';

@NgModule({
  declarations: [
    StoreComponent,
    StoreListComponent,
    StoreNewComponent
  ],
  imports: [CommonModule, StoreRoutingModule, ComponentsModule],
  exports: [
    StoreComponent,
    StoreListComponent,
    StoreNewComponent
  ]
})
export class StoreModule {}
