import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedSearchRoutingModule } from './saved-search-routing.module';
import { SavedSearchComponent } from './saved-search.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [SavedSearchComponent],
  imports: [
    CommonModule,
    SavedSearchRoutingModule,
    ComponentsModule
  ]
})
export class SavedSearchModule { }
