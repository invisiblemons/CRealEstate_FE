import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { AuthenPageComponent } from './authen.component/authen-page.component';
import { AuthComponent } from './auth.component';
import { CreateByGoogleComponent } from './create-by-google/create-by-google.component';
import { CreateByUserpassComponent } from './create-by-userpass/create-by-userpass.component';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ComponentsModule,
  ],
  declarations: [ForgotPassComponent, AuthenPageComponent, AuthComponent, CreateByGoogleComponent, CreateByUserpassComponent]
})
export class AuthModule { }
