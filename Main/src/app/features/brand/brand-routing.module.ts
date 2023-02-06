import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandEditComponent } from './brand-edit/brand-edit.component';
import { BrandEditGuard } from './brand-edit/brand-edit.guard';
import { BrandComponent } from './brand.component';
import { PasswordChangeComponent } from './password-change/password-change.component';

const routes: Routes = [
  {
    path: '',
    component: BrandComponent,
    children: [
      {
        path: 'chinh-sua',
        component: BrandEditComponent,
        canDeactivate: [BrandEditGuard],
      },
      {
        path: 'doi-mat-khau',
        component: PasswordChangeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandRoutingModule {}
