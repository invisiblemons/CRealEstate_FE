import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import { BrandService } from '../brand.service';
import swal from 'sweetalert2';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Brand } from '../brand.model';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { StringValidator } from 'src/app/shared/validator/string-validator';
import { PASSWORD_PATTERN } from 'src/app/shared/constants/common.const';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent implements OnInit {
  isShowSkeleton: boolean;
  loading: boolean;
  isShowDialog: boolean;

  password: string;
  newPassword: string;
  checkingPassword: string;
  brand: Brand;

  //validate
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errorMessage = '';

  brandForm!: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };

  private genericValidator: GenericValidator;

  isNeedUpdating: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private brandServices: BrandService,
    private reloadService: ReloadRouteService,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.isShowSkeleton = true;

    this.isShowDialog = true;
    this.loading = false; //validate
    this.validationMessages = {
      password: {
        required: 'Mật khẩu cũ không được để trống.',
      },
      newPassword: {
        required: 'Mật khẩu mới không được để trống.',
        pattern:
          'Mật khẩu chưa đúng định dạng',
      },
      checkingPassword: {
        required: 'Xác nhận mật khẩu không được để trống.',
        passwordNotMatch: 'Mật khẩu xác nhận phải trùng với mật khẩu mới',
      },
    };
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
    //validate
    this.brandForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      checkingPassword: [
        '',
        [Validators.required, StringValidator.confirmedPassword('newPassword')],
      ],
    });
  }

  ngOnInit(): void {
    this.brand = this.localStorage.getUserObject();
    this.isShowSkeleton = false;
    this.route.queryParams.subscribe((params) => {
      if (params['isNeedUpdating']) {
        this.isNeedUpdating = true;
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
    merge(this.brandForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.brandForm
        );
      });
  }

  hideDialog() {
    this.reloadService.routingReload('/ho-so', null);
  }

  changePassword() {
    this.loading = true;
    this.brandServices
      .updateBrandPassword({
        newPassword: this.newPassword,
        oldPassword: this.password,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.reloadService.routingReload('/ho-so', null);
          swal.fire({
            title: 'Thành công!',
            text: 'Đổi mật khẩu thành công.',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-success animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
        },
        error: (err) => {
          this.loading = false;
          swal.fire({
            title: 'Thất bại!',
            text: 'Mật khẩu cũ không chính xác.',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-danger animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
        },
      });
  }
}
