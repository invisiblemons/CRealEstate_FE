import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
registerLocaleData(localeVi);
import { SimpleScrollSpyModule } from 'angular-simple-scroll-spy';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TagInputModule } from 'ngx-chips';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarBrandComponent } from './navbar-brand/navbar-brand.component';
import { FilterComponent } from './filter/filter.component';

import { HttpClientModule } from '@angular/common/http';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
]);

import {
  DxHtmlEditorModule,
  DxButtonGroupModule,
  DxTemplateModule,
  DxButtonModule,
  DxPopupModule,
  DxPopoverModule,
  DxAutocompleteModule,
  DxTileViewModule,
  DxRangeSliderModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxFormModule,
  DxSchedulerModule,
} from 'devextreme-angular';

//Primeng Dependencies
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';
import { PictureUploadComponent } from './picture-upload/picture-upload.component';
import { SidebarModule } from 'primeng/sidebar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TabMenuModule } from 'primeng/tabmenu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ImageModule } from 'primeng/image';
import { DataViewModule } from 'primeng/dataview';
import { InputRestrictionDirective } from '../shared/directives/inputRestrictionDirective';
import { VerifyPopupComponent } from './verify-popup/verify-popup.component';
import { GalleriaModule } from 'primeng/galleria';

const PRIMENG_DEPENDENCIES = [
  TableModule,
  ToastModule,
  CalendarModule,
  SliderModule,
  MultiSelectModule,
  ContextMenuModule,
  DialogModule,
  ButtonModule,
  ProgressBarModule,
  DropdownModule,
  InputTextModule,
  RatingModule,
  FileUploadModule,
  ToolbarModule,
  RadioButtonModule,
  InputNumberModule,
  ConfirmDialogModule,
  InputTextareaModule,
  ProgressSpinnerModule,
  BadgeModule,
  CarouselModule,
  SkeletonModule,
  ChipModule,
  ConfirmPopupModule,
  FieldsetModule,
  TooltipModule,
  CascadeSelectModule,
  PasswordModule,
  DividerModule,
  CheckboxModule,
  TagModule,
  MessageModule,
  MessagesModule,
  KeyFilterModule,
  InputMaskModule,
  SidebarModule,
  DynamicDialogModule,
  OverlayPanelModule,
  ScrollTopModule,
  TabMenuModule,
  ScrollPanelModule,
  ImageModule,
  DataViewModule,
  FieldsetModule,
  GalleriaModule,
];

const DEVEXTREME_DEPENDENCIES = [
  DxHtmlEditorModule,
  DxButtonGroupModule,
  DxTemplateModule,
  DxButtonModule,
  DxPopupModule,
  DxPopoverModule,
  DxAutocompleteModule,
  DxTileViewModule,
  DxSelectBoxModule,
  DxRangeSliderModule,
  DxNumberBoxModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxFormModule,
  DxSchedulerModule,
];
const NGX_BOOTSTRAP_DEPENDENCIES = [
  ModalModule,
  TagInputModule,
  TimepickerModule,
  PopoverModule,
  BsDatepickerModule,
  AlertModule,
  PaginationModule,
  TabsModule,
  CollapseModule,
  ProgressbarModule,
  BsDropdownModule,
];

const SHARED_COMPONENTS = [
  InputRestrictionDirective,
  NavbarComponent,
  FooterComponent,
  NavbarBrandComponent,
  FilterComponent,
  PictureUploadComponent,
  VerifyPopupComponent,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SimpleScrollSpyModule,
    FullCalendarModule,
    /* 3rd party libraries */
    ...PRIMENG_DEPENDENCIES,
    ...DEVEXTREME_DEPENDENCIES,
    ...NGX_BOOTSTRAP_DEPENDENCIES,
    /* 3rd party libraries */
  ],
  declarations: [...SHARED_COMPONENTS],
  exports: [
    [...SHARED_COMPONENTS],
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    RouterModule,
    SimpleScrollSpyModule,
    FullCalendarModule,
    /* 3rd party libraries */
    ...PRIMENG_DEPENDENCIES,
    ...DEVEXTREME_DEPENDENCIES,
    ...NGX_BOOTSTRAP_DEPENDENCIES,
    /* 3rd party libraries */
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: LOCALE_ID, useValue: 'vi-VN' }],
})
export class ComponentsModule {}
