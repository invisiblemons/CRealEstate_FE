import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LandingPageRoutingModule } from './landing-page-routing.module'
import { LandingPageComponent } from './landing-page.component'
import { ComponentsModule } from 'src/app/components/components.module'

@NgModule({
  declarations: [LandingPageComponent],
  imports: [CommonModule, LandingPageRoutingModule, ComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPageModule {}
