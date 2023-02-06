import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { AboutUsComponent } from './about-us.component';

@NgModule({
  declarations: [AboutUsComponent],
  imports: [CommonModule, AboutUsRoutingModule, ComponentsModule],
})
export class AboutUsModule {}
