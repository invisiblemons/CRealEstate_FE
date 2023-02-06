import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { BrandLayoutComponent } from './layouts/brand/brand-layout.component';
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AuthService } from './features/authen-page/auth.service';
import { JwtIntercepter } from './features/authen-page/jwt.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainAuthLayoutComponent } from './layouts/main-auth/main-auth-layout.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#007AFD',
  bgsPosition: POSITION.centerCenter,
  bgsSize: 40,
  bgsType: SPINNER.ballSpinFadeRotating, // background spinner type
  fgsType: SPINNER.ballSpinFadeRotating, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
  textColor: '#007AFD',
  textPosition: POSITION.centerCenter,
  logoPosition: POSITION.centerCenter,
  logoSize: 180,
  gap: 0,
  logoUrl: '../assets/img/brand/crel-color.png',
  overlayColor: 'rgba(0,0,0,0.9)',
};

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    BrandLayoutComponent,
    MainAuthLayoutComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ComponentsModule,
    AppRoutingModule,
    RouterModule,

    // Import NgxUiLoaderModule with custom configuration globally
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    AngularFireModule.initializeApp(environment.firebaseConfig),

    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtIntercepter, multi: true },
    MessageService,
    ConfirmationService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
