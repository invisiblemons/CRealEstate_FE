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
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import { Appointment } from '../appointment.model';
import { AppointmentService } from '../appointment.service';
import swal from 'sweetalert2';
import moment from 'moment';
import { StringValidator } from 'src/app/shared/validator/string-validator';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
})
export class AppointmentEditComponent implements OnInit, OnDestroy {
  /* 
  fields for component
  */
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  isShowSkeleton: boolean;
  isShowDialog: boolean;
  loading: boolean;
  //validate
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  appointmentForm!: FormGroup;
  errorMessage = '';
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  //appointment
  appointment: Appointment;
  timeOptions: { date: Date; time: { label; value; inactive }; id: number }[] =
    [
      {
        date: null,
        time: { label: '08:00 AM', value: '8:0', inactive: false },
        id: 1,
      },
    ];

  times: { label: string; value: string; inactive: boolean }[];
  minDate: Date = new Date();

  constructor(
    private appointmentServices: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reloadService: ReloadRouteService
  ) {
    this.isShowDialog = true;
    this.isShowSkeleton = true;

    this.times = [
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
      id: [{ value: '', disabled: true }],
      onDate: ['', [Validators.required]],
      onTime: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroySubs$),
        switchMap((params) => {
          return this.appointmentServices.getAppointmentById(params['id']);
        })
      )
      .subscribe((appointment) => {
        this.appointment = appointment;
        let dateTime = new Date(this.appointment.onDateTime);
        this.times.forEach((time) => {
          if (time.value.split(':')[0] === dateTime.getHours().toString()) {
            this.timeOptions[0].time = time;
            this.appointmentForm.controls.onTime.setValue(time);
          }
        });
        this.timeOptions[0].date = dateTime;

        this.appointmentForm.controls.id.setValue(this.appointment.id);
        this.appointmentForm.controls.onDate.setValue(dateTime);
        this.appointmentForm.controls.description.setValue(
          this.appointment.description
        );
        this.isShowSkeleton = false;
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
      .subscribe(() => {
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
  hideDialog() {
    this.reloadService.routingNotReload('/cuoc-hen/danh-sach', null);
  }

  onSelectDate(date, index) {
    this.timeOptions[index].date = date;
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
                    moment(appm.onDateTime).format("hh:mm a") +
                    '. Vui lòng chọn giờ khác.',
                  icon: 'warning',
                  customClass: {
                    confirmButton: 'btn btn-warning animation-on-hover',
                  },
                  buttonsStyling: false,
                  timer: 3000,
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

  saveAppointment() {
    this.loading = true;
    this.appointment.onDateTime = new Date(
      moment(this.getDateFromCustomObject(this.timeOptions[0]))
        .utcOffset(0, true)
        .format('YYYY-MM-DDThh:mm:ssZ')
    );
    this.appointment.status = 1;
    this.appointmentServices
      .updateAppointment(this.appointment)
      .subscribe((appointment) => {
        this.loading = false;
        this.reloadService.routingReload('/cuoc-hen/danh-sach', null);
        swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật cuộc hẹn thành công.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success animation-on-hover',
          },
          buttonsStyling: false,
          timer: 2000,
        });
      });
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
}
