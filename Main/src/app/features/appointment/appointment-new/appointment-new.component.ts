import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  fromEvent,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Broker } from 'src/app/features/broker/broker.model';
import { District } from 'src/app/shared/models/district.model';
import { StreetSegment } from 'src/app/shared/models/streetSegment.model';
import { Ward } from 'src/app/shared/models/ward.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { BrokerService } from '../../broker/broker.service';
import { Property } from '../../property/property.model';
import { PropertyService } from '../../property/property.service';
import { Appointment } from '../appointment.model';
import { AppointmentService } from '../appointment.service';
import swal from 'sweetalert2';
import { Brand } from '../../brand/brand.model';
import { PrimeNGConfig } from 'primeng/api';
import { default as data } from '../../../../assets/json/vi.json';
import moment from 'moment';
import { ShareDataService } from 'src/app/shared/services/share-data.service';
import { StringValidator } from 'src/app/shared/validator/string-validator';

@Component({
  selector: 'app-appointment-new',
  templateUrl: './appointment-new.component.html',
  styleUrls: ['./appointment-new.component.scss'],
})
export class AppointmentNewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  loading: boolean = false;
  /* 
  fields for object
  */
  //appointment
  appointment: Appointment = new Appointment(null, false);
  timeOptions: { date: Date; time: { label; value; inactive }; id: number }[] =
    [
      {
        date: null,
        time: { label: '08:00 AM', value: '8:0', inactive: false },
        id: 1,
      },
    ];
  //property
  properties: Property[];
  property: Property;
  // Broker
  broker: Broker;
  //location
  street: StreetSegment;
  ward: Ward;
  district: District;
  //brand
  brand: Brand;
  // Datetime
  times: { label: string; value: string; inactive: boolean }[];
  tempTimes: { label: string; value: string; inactive: boolean }[];
  minDate: Date = new Date();

  /* 
  fields for component
  */
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  isShowSkeleton: boolean;
  // validate
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  errorMessage = '';
  appointmentForm!: FormGroup;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  isDeleted: boolean = false;

  isShowBroker: boolean = false;

  description: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reloadService: ReloadRouteService,
    private fb: FormBuilder,
    private propertyServices: PropertyService,
    private locationServices: LocationService,
    private appoitmentServices: AppointmentService,
    private localStorage: LocalStorageService,
    private brokerServices: BrokerService,
    private primengConfig: PrimeNGConfig,
    private appointmentServices: AppointmentService,
    private shareDataServices: ShareDataService,
    private localStorageServices: LocalStorageService
  ) {
    this.tempTimes = [
      { label: '08:00 AM', value: '8:0', inactive: false },
      { label: '09:00 AM', value: '9:0', inactive: false },
      { label: '10:00 AM', value: '10:0', inactive: false },
      { label: '11:00 AM', value: '11:0', inactive: false },
      { label: '12:00 AM', value: '12:0', inactive: false },
      { label: '02:00 PM', value: '14:0', inactive: false },
      { label: '03:00 PM', value: '15:0', inactive: false },
      { label: '04:00 PM', value: '16:0', inactive: false },
      { label: '05:00 PM', value: '17:0', inactive: false },
      { label: '06:00 PM', value: '18:0', inactive: false },
      { label: '07:00 PM', value: '19:0', inactive: false },
    ];

    this.minDate = new Date(this.minDate.setDate(this.minDate.getDate() + 1));

    // Config VI for calendar
    this.primengConfig.setTranslation(data.primeng);

    this.isShowSkeleton = true;

    //validate
    this.validationMessages = {
      onDate: {
        required: 'Ngày không được để trống.',
      },
      onTime: {
        required: 'Giờ không được để trống.',
        invalid: 'Nhân viên môi giới đã có cuộc hẹn vào giờ này.',
      },
    };
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
    //validate
    this.appointmentForm = this.fb.group({
      onDate: ['', [Validators.required]],
      onTime: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.brand = this.localStorage.getUserObject();
    this.route.queryParams.subscribe((params) => {
      if (params['isFromProperty'] === 'true') {
        this.propertyServices
          .getPropertyById(params['property'])
          .pipe(
            takeUntil(this.destroySubs$),
            switchMap((property) => {
              this.property = property;
              return this.brokerServices.getBrokerById(this.property.brokerId);
            })
          )
          .subscribe((broker) => {
            this.broker = broker;
          });
      }
    });
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.appointmentForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.appointmentForm
        );
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  // Routing Functions
  redirectToProperties() {
    this.reloadService.routingReload('/mat-bang-cho-thue', null);
  }
  routingDetailProperty(property) {
    // this.router.navigate(['/cuoc-hen/tao-moi/mat-bang-chi-tiet'], {
    //   queryParams: { id: property.id, isFromCreateAppm: true },
    // });
  }

  //Form Functions
  addTime(length) {
    this.timeOptions = [
      ...this.timeOptions,
      {
        date: new Date(),
        time: { label: '08:00 AM', value: '8:0', inactive: false },
        id: length + 1,
      },
    ];
  }
  deleteTime(index) {
    this.timeOptions = this.timeOptions.filter(
      (item) => item.id !== this.timeOptions[index].id
    );
  }

  onSelectDate(date) {
    this.timeOptions[0].date = date;
    let minDate = new Date(
      this.timeOptions[0].date.getFullYear(),
      this.timeOptions[0].date.getMonth(),
      this.timeOptions[0].date.getDate(),
      1,
      0,
      0
    );
    let maxDate = new Date(
      this.timeOptions[0].date.getFullYear(),
      this.timeOptions[0].date.getMonth(),
      this.timeOptions[0].date.getDate(),
      23,
      59,
      59
    );
    let num = null;
    this.appointmentServices
      .getAppointmentByDate(
        moment(minDate).format('YYYY-MM-DDThh:mm:ss') + 'Z',
        moment(maxDate).format('YYYY-MM-DDThh:mm:ss') + 'Z'
      )
      .subscribe((appms) => {
        if (appms.length > 0) {
          let appmsActive = [];
          appms.forEach((appm) => {
            if (appm.status === 1 || appm.status === 2) {
              appmsActive.push(appm);
              let seclectedTime = new Date(
                this.getDateFromCustomObject(this.timeOptions[0])
              );
              let dateOfAppm = new Date(appm.onDateTime);
              this.tempTimes.forEach((time) => {
                if (
                  time.value.split(':')[0] === dateOfAppm.getHours().toString()
                ) {
                  time.inactive = true;
                }
              });
            }
          });
        }
      });
  }
  clickTime() {
    this.times = this.tempTimes;
  }
  onSelectTime(ev) {
    this.appointmentForm.get('onTime').clearValidators();
    this.appointmentForm.get('onTime').setValidators([Validators.required]);
    this.appointmentForm.controls['onTime'].updateValueAndValidity();

    this.timeOptions[0].time = ev.value;
    let minDate = new Date(
      this.timeOptions[0].date.getFullYear(),
      this.timeOptions[0].date.getMonth(),
      this.timeOptions[0].date.getDate(),
      1,
      0,
      0
    );
    let maxDate = new Date(
      this.timeOptions[0].date.getFullYear(),
      this.timeOptions[0].date.getMonth(),
      this.timeOptions[0].date.getDate(),
      23,
      59,
      59
    );
    let num = null;
    this.appointmentServices
      .getAppointmentByDate(
        moment(minDate).format('YYYY-MM-DDThh:mm:ss') + 'Z',
        moment(maxDate).format('YYYY-MM-DDThh:mm:ss') + 'Z'
      )
      .subscribe((appms) => {
        if (appms.length > 0) {
          let appmsActive = [];
          appms.forEach((appm) => {
            if (appm.status === 1 || appm.status === 2) {
              appmsActive.push(appm);
              let seclectedTime = new Date(
                this.getDateFromCustomObject(this.timeOptions[0])
              );
              let dateOfAppm = new Date(appm.onDateTime);
              if (dateOfAppm.getHours() === seclectedTime.getHours()) {
                swal.fire({
                  title: 'Cảnh báo!',
                  text:
                    'Ngày bạn chọn nhân viên môi giới đã có cuộc hẹn vào lúc ' +
                    moment(appm.onDateTime).format('hh:mm a') +
                    '. Vui lòng chọn giờ khác.',
                  icon: 'warning',
                  customClass: {
                    confirmButton: 'btn btn-warning animation-on-hover',
                  },
                  buttonsStyling: false,
                  timer: 2000,
                });
                this.appointmentForm.controls['onTime'].clearValidators();
                this.appointmentForm.controls['onTime'].setValidators([
                  Validators.required,
                  StringValidator.invalid(),
                ]);
                this.appointmentForm.controls['onTime'].setErrors({
                  invalid: true,
                });
                this.appointmentForm.controls[
                  'onTime'
                ].updateValueAndValidity();
              }
            }
          });
        }
      });
  }

  createAppointment() {
    if (
      this.appointmentForm.get('onTime').value === null ||
      this.appointmentForm.get('onTime').value === ''
    ) {
      this.appointmentForm.get('onTime').clearValidators();
      this.appointmentForm.get('onTime').setValidators([Validators.required]);
      this.appointmentForm.get('onTime').setErrors({ required: true });
      this.appointmentForm.controls['onTime'].updateValueAndValidity();
    } else {
      this.loading = true;
      this.appointment.brandId = this.brand.id;
      this.appointment.brokerId = this.property.brokerId;
      this.appointment.onDateTime = new Date();
      this.appointment.propertyId = this.property.id;
      this.appointment.onDateTime = new Date(
        moment(this.getDateFromCustomObject(this.timeOptions[0]))
          .utcOffset(0, true)
          .format('YYYY-MM-DDThh:mm:ssZ')
      );
      this.appointment.description = this.description;
      this.propertyServices
        .getPropertyById(this.property.id)
        .pipe(
          takeUntil(this.destroySubs$),
          switchMap((property) => {
            if (property.status === 2) {
              return this.appoitmentServices.insertAppointment(
                this.appointment
              );
            } else return of(false);
          })
        )
        .subscribe((res) => {
          if (res) {
            this.localStorage.deleteAllPropertiesInAppointment();
            this.reloadService.routingReload('/cuoc-hen/danh-sach', null);
            swal.fire({
              title: 'Thành công!',
              text: 'Tạo thành công cuộc hẹn.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success animation-on-hover',
              },
              buttonsStyling: false,
              timer: 2000,
            });
          } else {
            this.localStorage.deleteAllPropertiesInAppointment();
            this.reloadService.routingReload('/mat-bang-cho-thue', null);
            swal.fire({
              title: 'Thất bại!',
              text: 'Bất động sản không còn tồn tại. Xin hãy đặt lại lịch hẹn.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-danger animation-on-hover',
              },
              buttonsStyling: false,
              timer: 2000,
            });
          }
          this.loading = false;
        });
    }
  }

  getDateFromCustomObject(timeOption) {
    return new Date(
      timeOption.date.getFullYear(),
      timeOption.date.getMonth(),
      timeOption.date.getDate(),
      Number(timeOption.time.value.split(':')[0]),
      Number(timeOption.time.value.split(':')[1]),
      0
    );
  }

  getDeletedStatus(value) {
    if (value) {
      this.isDeleted = true;
    }
  }
  openBrokerDetail() {
    this.isShowBroker = true;
  }

  statusBrokerDialog() {
    this.isShowBroker = false;
  }
}
