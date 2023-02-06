import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { BrandEditComponent } from './brand-edit/brand-edit.component';
import { PasswordChangeComponent } from './password-change/password-change.component';

@NgModule({
  declarations: [BrandComponent, BrandEditComponent, PasswordChangeComponent],
  imports: [CommonModule, BrandRoutingModule, ComponentsModule],
})
export class BrandModule {}
