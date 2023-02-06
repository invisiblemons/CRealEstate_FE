import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyComponent } from './property.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyComponent,
    children: [
      {
        path: 'chi-tiet',
        component: PropertyDetailComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyRoutingModule {}
