import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { BrandLayoutComponent } from './layouts/brand/brand-layout.component';
import { AuthGuardService } from './features/authen-page/guard/auth-guard.service';
import { MainAuthLayoutComponent } from './layouts/main-auth/main-auth-layout.component';
import { MainAuthGuardService } from './features/authen-page/guard/main-auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'trang-chu',
        pathMatch: 'full',
      },
      {
        path: 'trang-chu',
        loadChildren: () =>
          import('./features/landing-page/landing-page.module').then(
            (m) => m.LandingPageModule
          ),
      },
      {
        path: 'xac-thuc',
        loadChildren: () =>
          import('./features/authen-page/auth.module').then(
            (m) => m.AuthModule
          ),
      },
    ],
  },
  {
    path: '',
    component: MainAuthLayoutComponent,
    canActivate: [MainAuthGuardService],
    children: [
      {
        path: 'mat-bang',
        loadChildren: () =>
          import('./features/property/property.module').then(
            (m) => m.PropertyModule
          ),
      },
      {
        path: 'moi-gioi',
        loadChildren: () =>
          import('./features/broker/broker.module').then(
            (m) => m.BrokerModule
          ),
      },
    ],
  },
  {
    path: '',
    component: BrandLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'trang-chu',
        pathMatch: 'full',
      },
      {
        path: 'trang-chu',
        loadChildren: () =>
          import('./features/landing-page/landing-page.module').then(
            (m) => m.LandingPageModule
          ),
      },
      {
        path: 'mat-bang-cho-thue',
        loadChildren: () =>
          import('./features/property/property.module').then(
            (m) => m.PropertyModule
          ),
      },
      {
        path: 'tim-kiem-nang-cao',
        loadChildren: () =>
          import('./features/advanced-search/advanced-search.module').then(
            (m) => m.AdvancedSearchModule
          ),
      },
      {
        path: 've-chung-toi',
        loadChildren: () =>
          import('./features/about-us/about-us.module').then(
            (m) => m.AboutUsModule
          ),
      },
      {
        path: 'ho-so',
        loadChildren: () =>
          import('./features/brand/brand.module').then((m) => m.BrandModule),
      },
      {
        path: 'cuoc-hen',
        loadChildren: () =>
          import('./features/appointment/appointment.module').then(
            (m) => m.AppointmentModule
          ),
      },
      {
        path: 'yeu-thich',
        loadChildren: () =>
          import('./features/wishlist/wishlist.module').then(
            (m) => m.WishlistModule
          ),
      },
      {
        path: 'tim-kiem-da-luu',
        loadChildren: () =>
          import('./features/saved-search/saved-search.module').then(
            (m) => m.SavedSearchModule
          ),
      },
      {
        path: 'nguoi-moi-gioi',
        loadChildren: () =>
          import('./features/broker/broker.module').then(
            (m) => m.BrokerModule
          ),
      },
      {
        path: 'hop-dong',
        loadChildren: () =>
          import('./features/contract/contract.module').then(
            (m) => m.ContractModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
