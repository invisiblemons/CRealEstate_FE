import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreNewComponent } from '../store/store-new/store-new.component';
import { AdvancedSearchComponent } from './advanced-search.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdvancedSearchComponent,
    children: [
      {
        path: 'chi-tiet-mat-bang',
        component: PropertyDetailComponent
      },
      {
        path: 'tao-moi-cua-hang',
        component: StoreNewComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancedSearchRoutingModule { }
