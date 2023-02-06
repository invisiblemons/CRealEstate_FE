import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { fromEvent, merge, Observable, of, Subject, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  finalize,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from 'src/app/shared/constants/common.const';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import swal from 'sweetalert2';
import { Brand } from '../brand.model';
import { BrandService } from '../brand.service';
import { Router } from '@angular/router';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { LocalStorageService } from '../../authen-page/local-storage.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { Industry } from 'src/app/shared/models/industry.model';
import { StringValidator } from 'src/app/shared/validator/string-validator';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss'],
})
export class BrandEditComponent implements OnInit, AfterViewInit, OnDestroy {
  destroySubs$: Subject<boolean> = new Subject<boolean>();

  isShowDialog: boolean;

  isShowSkeleton: boolean;

  loading: boolean;

  brand: Brand;

  checkingPassword: string;

  // PhoneNumber
  isChangedPhoneNumber: boolean;

  //image
  avatarFile: File;

  changedImg: boolean;

  //validate
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errorMessage = '';

  brandForm!: FormGroup;

  //industry
  industry: Industry;

  industries: Industry[] = [];

  selectedIndustry: Industry;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };

  private genericValidator: GenericValidator;

  isShowUserName: boolean = false;

  isChangePhone: boolean = false;
  isChangeEmail: boolean = false;

  isError: boolean = false;

  constructor(
    private brandServices: BrandService,
    private localStorage: LocalStorageService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private router: Router,
    private reloadService: ReloadRouteService,
    private industryServices: IndustryService
  ) {
    this.brand = new Brand(null, false);

    this.isShowSkeleton = true;

    this.isShowDialog = true;

    this.loading = false;

    //image
    this.changedImg = false;

    //validate
    this.validationMessages = {
      name: {
        required: 'Tên không được để trống.',
        minlength: 'Tên phải có ít nhất 3 kí tự.',
        maxlength: 'Tên có nhiều nhất 100 kí tự.',
      },
      phoneNumber: {
        required: 'Số điện thoại không được để trống.',
        invalid: 'Số điện thoại đã tồn tại',
      },
      email: {
        required: 'Địa chỉ email không được để trống.',
        pattern: 'Địa chỉ email không hợp lệ',
        invalid: 'Địa chỉ email đã tồn tại',
      },
      registrationNumber: {
        required: 'Mã số doanh nghiệp không được để trống.',
      },
      industry: {
        required: 'Ngành kinh doanh không được để trống.',
      },
      userName: {
        required: 'Tài khoản không được để trống.',
        minlength: 'Tài khoản phải có ít nhất 3 kí tự.',
        maxlength: 'Tài khoản có nhiều nhất 100 kí tự.',
        invalid: 'Tài khoản đã tồn tại',
      },
      password: {
        required: 'Mật khẩu không được để trống.',
        pattern:
          'Mật khẩu chưa đúng định dạng',
      },
      checkingPassword: {
        required: 'Mật khẩu xác nhận không được để trống.',
        passwordNotMatch: 'Mật khẩu xác nhận phải trùng với mật khẩu mới',
      },
    };
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
    //validate
    this.brandForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      userName: [''],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      phoneNumber: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      password: [''],
      checkingPassword: [''],
    });
  }

  ngOnInit(): void {
    this.brand = this.localStorage.getUserObject();
    this.industryServices.getIndustries().subscribe((industries) => {
      this.industries = industries;
      this.brand = this.updateIndustry(this.brand);
      this.selectedIndustry = this.brand.industry;
      if (!this.brand.userName) {
        this.isShowUserName = true;
        this.brandForm
          .get('userName')
          .setValidators([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]);
        this.brandForm.controls['userName'].updateValueAndValidity();
        this.brandForm.get('password').setValidators([Validators.required,, Validators.pattern(PASSWORD_PATTERN)]);
        this.brandForm.controls['password'].updateValueAndValidity();
        this.brandForm
          .get('checkingPassword')
          .setValidators([
            Validators.required,
            StringValidator.confirmedPassword('password'),
          ]);
        this.brandForm.controls['checkingPassword'].updateValueAndValidity();
      }
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
    merge(this.brandForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.brandForm
        );
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  hideDialog() {
    this.reloadService.routingReload('/ho-so', null);
  }

  //data functions
  getIndustry(brand: Brand): Industry {
    for (let i = 0; i < this.industries.length; i++) {
      if (brand.industryId === this.industries[i].id) {
        return this.industries[i];
      }
    }
    return;
  }
  updateIndustry(brand: Brand): Brand {
    let industry = this.getIndustry(brand);
    if (industry) {
      brand.industry = industry;
      brand.industryName = industry.name;
    }
    return brand;
  }

  // Image Function
  getImgFromChild(imgFile) {
    this.avatarFile = imgFile;
    this.changedImg = true;
  }

  changeInputPhoneStyle() {
    this.isChangedPhoneNumber = true;
  }

  updateBrand() {
    this.loading = true;
    this.brand.email = this.brand.email.toLowerCase();
    this.brand.industryId = this.selectedIndustry.id;
    this.brandServices
      .updateBrand(new Brand(this.brand, false))
      .pipe(
        takeUntil(this.destroySubs$),
        switchMap((brand) => {
          if (this.brand.password) {
            return this.brandServices.updateBrandPassword({
              newPassword: this.brand.password,
              oldPassword: null,
            });
          } else {
            return of(brand);
          }
        }),
        switchMap((brand) => {
          if (this.changedImg) {
            let formData: FormData = new FormData();
            formData.append('file', this.avatarFile);
            return this.brandServices.updateBrandAvatar(formData);
          }
          return of(brand);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (brand) => {
          this.localStorage.setUserObject(brand);
          swal.fire({
            title: 'Thành công!',
            text: 'Cập nhật brand thành công.',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-success animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
          this.brandForm.reset();
          this.hideDialog();
        },
        error: (error) => {
          if (error.error.message === 'UserName is already exist') {
            this.brandForm
              .get('userName')
              .setValidators([StringValidator.invalid()]);
            this.brandForm.controls['userName'].updateValueAndValidity();
          } else if (error.error.message === 'Email is already exist') {
            this.brandForm
              .get('email')
              .setValidators([StringValidator.invalid()]);
            this.brandForm.controls['email'].updateValueAndValidity();
          } else if (error.error.message === 'PhoneNumber is already exist') {
            this.brandForm
              .get('phoneNumber')
              .setValidators([StringValidator.invalid()]);
            this.brandForm.controls['phoneNumber'].updateValueAndValidity();
          } else {
            swal.fire({
              title: 'Thất bại!',
              text: 'Cập nhật tài khoản thất bại vui lòng thử lại.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-info animation-on-hover',
              },
              buttonsStyling: false,
              timer: 2000,
            });
          }
        },
      });
  }

  onChangeUserName() {
    this.brandForm.get('userName').clearValidators();
    this.brandForm
      .get('userName')
      .setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]);
    this.brandForm.controls['userName'].updateValueAndValidity();
  }
  onChangeEmail() {
    this.brandForm.get('email').clearValidators();
    this.brandForm
      .get('email')
      .setValidators([Validators.required, Validators.pattern(EMAIL_PATTERN)]);
    this.brandForm.controls['email'].updateValueAndValidity();
  }
  onChangePhone() {
    this.brandForm.get('phoneNumber').clearValidators();
    this.brandForm.get('phoneNumber').setValidators([Validators.required]);
    this.brandForm.controls['phoneNumber'].updateValueAndValidity();
  }
}
