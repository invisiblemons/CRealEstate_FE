import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  Calendar,
  CalendarOptions,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { SelectItem } from 'primeng/api';
import {
  debounceTime,
  fromEvent,
  merge,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Column } from 'src/app/shared/models/table.model';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { Brand } from '../../brand/brand.model';
import { BrokerService } from '../../broker/broker.service';
import { Property } from '../../property/property.model';
import { Appointment } from '../appointment.model';
import { AppointmentService } from '../appointment.service';
import viLocale from '@fullcalendar/core/locales/vi';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import {
  FULL_DATE_TIME_FORMAT,
  TABLE_CONFIG,
} from 'src/app/shared/constants/common.const';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit,AfterViewInit, OnDestroy {
  calendar: any;
  FULL_DATE_TIME_FORMAT = FULL_DATE_TIME_FORMAT;
  /* 
  fields for component
  */
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  isShowSkeleton: boolean;
  calendarEvents: any = [];
  isShowCancelModal: boolean;
  reasons: string[];
  // FullCalendar
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    locale: viLocale,
  };
  // Table
  cols: Column[];
  _selectedColumns: Column[];
  TABLE_CONFIG = TABLE_CONFIG;
  first = 0;
  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter(
      (col: Column) => val.includes(col) || col.disabled
    );
  }

  isShowSpin: boolean;
  /* 
  fields for object
  */
  // Appointment
  appointment: Appointment;
  appointments: Appointment[];
  appointmentsDataTable: Appointment[];
  statuses: { label: string; value: number }[];
  rejectMessage: string = '';
  //property
  properties: Property[] = [];
  currentDate: Date = new Date();
  //brand
  brand: Brand;

  /*
  Validate
  */
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errorMessage = '';

  cancelForm!: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };

  private genericValidator: GenericValidator;

  index: number;
  
  isShowBroker = false;

  constructor(
    private appointmentServices: AppointmentService,
    private localStorage: LocalStorageService,
    private brokerService: BrokerService,
    private router: Router,
    private fb: FormBuilder,
    private reloadServices: ReloadRouteService
  ) {
    this.calendar = new Calendar(
      document.getElementById('calendar') as HTMLElement,
      { plugins: [dayGridPlugin] }
    );
    this.isShowSpin = true;
    this.isShowCancelModal = false;
    this.reasons = [
      'Không thể tham gia cuộc hẹn',
      'Không có nhu cầu coi những mặt bằng này',
    ];

    // validate
    this.validationMessages = {
      rejectMessage: {
        required: 'Lý do xoá bỏ không được để trống.',
      },
    };
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

    // validate
    this.cancelForm = this.fb.group({
      rejectMessage: ['', [Validators.required]],
    });

    this.statuses = [
      { label: 'Đợi xét duyệt', value: 1 },
      { label: 'Sắp diễn ra', value: 2 },
      { label: 'Không được duyệt', value: 3 },
      { label: 'Đã diễn ra', value: 4 },
      { label: 'Diễn ra thất bại', value: 5 },
      { label: 'Yêu cầu duyệt', value: 6 },
    ];
    this.cols = [
      {
        field: 'onDateTime',
        header: 'Thời gian diễn ra',
        width: '10rem',
        headerAlign: 'center',
        textAlign: 'center',
        visible: true,
        disabled: true,
      },
      {
        field: 'brokerName',
        header: 'Môi giới',
        width: '10rem',
        headerAlign: 'center',
        textAlign: 'center',
        visible: true,
        disabled: true,
      },
      // {
      //   field: 'name',
      //   preField: 'broker',
      //   header: 'Tên môi giới',
      //   width: '10rem',
      //   headerAlign: 'left',
      //   textAlign: 'left',
      //   visible: true,
      //   disabled: true,
      // },
      // {
      //   field: 'phoneNumber',
      //   preField: 'broker',
      //   header: 'Số điện thoại',
      //   width: '10rem',
      //   headerAlign: 'right',
      //   textAlign: 'right',
      //   visible: true,
      //   disabled: true,
      // },
      {
        field: 'description',
        header: 'Lời nhắn',
        width: '10rem',
        headerAlign: 'left',
        textAlign: 'left',
        visible: true,
        disabled: true,
      },
      {
        field: 'status',
        header: 'Trạng thái',
        width: '10rem',
        headerAlign: 'center',
        textAlign: 'center',
        disabled: true,
        visible: true,
      },
      {
        field: 'action',
        header: 'Thao tác',
        width: '10rem',
        headerAlign: 'center',
        textAlign: 'center',
        visible: true,
        disabled: true,
      },
    ];
    this._selectedColumns = this.cols.filter((element) => element.visible);
  }

  ngOnInit(): void {
    this.brand = this.localStorage.getUserObject();
    this.appointmentServices
      .getAppointmentByBrandId(this.brand.id)
      .pipe(
        takeUntil(this.destroySubs$),
        switchMap((appointments) => {
          this.appointments = appointments;
          return this.brokerService.getBrokers();
        })
      )
      .subscribe((brokers) => {
        this.appointments = this.getBrokerOfAppointment(
          this.appointments,
          brokers
        );
        this.appointmentsDataTable = this.appointments;
        this.setCalendarEvent(this.appointments);
        this.calendarOptions.events = this.calendarEvents;
        this.isShowSpin = false;
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
    merge(this.cancelForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.cancelForm
        );
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  // FullCalendar
  handleDateClick(arg) {
    alert('date click! ' + arg);
  }

  // Data Functions
  getBrokerOfAppointment(appointments, brokers): Appointment[] {
    appointments.forEach((appm) => {
      appm.broker = brokers.filter((broker) => appm.brokerId === broker.id)[0];
    });
    return appointments;
  }
  setCalendarEvent(appms) {
    let pipe = new DatePipe('vi-VN');
    appms.forEach((appm: Appointment) => {
      if (appm.status === 1 || appm.status === 2) {
        let event = {
          id: appm.id,
          title: '',
          date: appm.onDateTime,
        };
        this.calendarEvents = [...this.calendarEvents, event];
      }
    });
  }

  // Routing Functions
  routingDetailProperty(property) {
    this.router.navigate(['/cuoc-hen/danh-sach/mat-bang-chi-tiet'], {
      queryParams: { id: property.id, isFromAppmList: true },
    });
  }
  openEditAppointment(selectedAppointment) {
    this.reloadServices.routingNotReload(
      "/cuoc-hen/danh-sach/chinh-sua",
      selectedAppointment.id
    );
  }

  /*
  Table
  */
  // paging
  next() {
    this.first = this.first + this.TABLE_CONFIG.ROWS;
  }
  prev() {
    this.first = this.first - this.TABLE_CONFIG.ROWS;
  }
  reset() {
    this.first = 0;
  }
  isLastPage(): boolean {
    return this.appointments
      ? this.first === this.appointments.length - this.TABLE_CONFIG.ROWS
      : true;
  }
  isFirstPage(): boolean {
    return this.appointments ? this.first === 0 : true;
  }
  openCancelModal(appointment) {
    this.isShowCancelModal = true;
  }
  hideCancelModal() {
    this.isShowCancelModal = false;
  }

  // Table Functions
  deleteAppointment(appm, index) {
    swal
      .fire({
        title: 'Bạn có chắc muốn xoá?',
        text: 'Cuộc hẹn này này sẽ bị xoá!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, xoá nó!',
        cancelButtonText: 'Không, giữ nguyên',
        customClass: {
          confirmButton: 'btn btn-danger animation-on-hover mr-1',
          cancelButton: 'btn btn-default animation-on-hover',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          this.appointment = appm;
          this.index = index;
          this.openCancelModal(appm);
        }
      });
  }

  deleteFromModal() {
    this.appointmentServices.deleteAppointment(this.appointment).subscribe((res) => {
      this.appointments = this.appointments.filter(
        (appm) => appm.id !== this.appointments[this.index].id
      );
      this.appointmentsDataTable = this.appointments;
      swal.fire({
        title: 'Xoá thành công!',
        text: 'Đã xoá cuộc hẹn.',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-success animation-on-hover',
        },
        buttonsStyling: false,
        timer: 2000,
      });
      this.isShowCancelModal = false;
      this.index = null;
      this.reloadServices.routingReload(
        "/cuoc-hen/danh-sach",null
      );
    });
  }

  verify(appointment, index) {
    swal
      .fire({
        title: 'Xét duyệt cuộc hẹn được tạo bởi người môi giới',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Từ chối',
        customClass: {
          confirmButton: 'btn btn-success animation-on-hover mr-1',
          cancelButton: 'btn btn-warning animation-on-hover',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          appointment.status = 2;
          this.appointmentServices
            .updateAppointment(appointment)
            .subscribe((appointment) => {
              swal.fire({
                title: 'Thành công!',
                text: 'Xét duyệt cuộc hẹn thành công.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-success animation-on-hover',
                },
                buttonsStyling: false,
                timer: 2000,
              });
            });
        } else {
          this.appointment.status = 3;
          this.appointment.rejectMessage = this.rejectMessage;
          this.appointmentServices
            .updateAppointment(this.appointment)
            .subscribe((appointment) => {
              swal.fire({
                title: 'Thành công!',
                text: 'Từ chối xét duyệt cuộc hẹn thành công.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-success animation-on-hover',
                },
                buttonsStyling: false,
                timer: 2000,
              });
            });
        }
      });
  }

  openBrokerDetail(appointment) {
    this.appointment = appointment;
    this.isShowBroker = true;
  }

  statusBrokerDialog() {
    this.isShowBroker = false;
  }
}
