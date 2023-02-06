import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChildren,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Industry } from 'src/app/shared/models/industry.model';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Brand } from '../../brand/brand.model';
import { BrandService } from '../../brand/brand.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { Account } from '../user.model';
import swal from 'sweetalert2';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
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
import { StringValidator } from 'src/app/shared/validator/string-validator';
import { Router } from '@angular/router';
import { PASSWORD_PATTERN } from 'src/app/shared/constants/common.const';

@Component({
  selector: 'app-authen-page',
  templateUrl: 'authen-page.component.html',
  styleUrls: ['./authen-page.component.scss'],
})
export class AuthenPageComponent implements OnInit, AfterViewInit, OnDestroy {
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  /*
  Fields of component
  */
  signUpLoading: boolean = false;
  loginLoading: boolean = false;

  isShowGoogle: boolean = false;
  isShowUserPass: boolean = false;
  /*
  Fields of object
  */
  userNameLogin: string;
  passwordLogin: string;
  userNameSignUp: string;
  passwordSignUp: string;
  confirmedPassword: string;

  account: Account;
  ggInfo: any;

  //validate
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  errorMessage = '';
  editorValueType: string;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  brand: Brand = new Brand(null, false);

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private ngZone: NgZone,
    private industryService: IndustryService,
    private brandService: BrandService,
    private reloadService: ReloadRouteService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.account = new Account(null);

    //validate
    this.validationMessages = {
      userNameLogin: {
        required: 'Tài khoản không được để trống.',
        minlength: 'Tài khoản phải có ít nhất 3 kí tự.',
        maxlength: 'Tài khoản có nhiều nhất 100 kí tự.',
      },
      userNameSignUp: {
        required: 'Tài khoản không được để trống.',
        minlength: 'Tài khoản phải có ít nhất 3 kí tự.',
        maxlength: 'Tài khoản có nhiều nhất 100 kí tự.',
        invalid: 'Tài khoản đã tồn tại',
      },
      passwordLogin: {
        required: 'Mật khẩu không được để trống.',
      },
      passwordSignUp: {
        required: 'Mật khẩu không được để trống.',
        pattern:
          'Mật khẩu chưa đúng định dạng',
      },
      confirmedPassword: {
        required: 'Mật khẩu không được để trống.',
        passwordNotMatch: 'Mật khẩu xác nhận phải trùng với mật khẩu đã nhập',
      },
    };

    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

    //validate

    this.signUpForm = this.fb.group({
      userNameSignUp: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      passwordSignUp: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      confirmedPassword: [
        '',
        [
          Validators.required,
          StringValidator.confirmedPassword('passwordSignUp'),
        ],
      ],
    });

    this.loginForm = this.fb.group({
      userNameLogin: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      passwordLogin: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('authen-page');
    let signUpButton = document.getElementById('signUp');
    let signInButton = document.getElementById('signIn');
    let container = document.getElementById('container');
    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });
    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
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
    merge(this.signUpForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(
          this.signUpForm
        );
      });
    merge(this.loginForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(
          this.loginForm
        );
      });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('authen-page');
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  setUser(user) {
    this.localStorageService.setUser(user);
    //not had appm of this user
    if (!this.localStorageService.getSpecificAppointment()) {
      this.localStorageService.setNewAppointment('');
    }
  }

  // Login user with  provided Email/ Password
  loginUser() {
    this.loginLoading = true;
    this.account.userName = this.userNameLogin;
    this.account.password = this.passwordLogin;
    this.authService.loginWithAccount(this.account).subscribe({
      next: (res) => {
        this.setUser(res);
        swal.fire({
          title: 'Thành công!',
          text: 'Đăng nhập thành công.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success animation-on-hover',
          },
          buttonsStyling: false,
          timer: 2000,
        });
        if (res.user.status === 2) {
          this.reloadService.routingReload('/mat-bang-cho-thue', null);
        } else {
          this.reloadService.routingReload('/mat-bang', null);
        }
        this.loginLoading = false;
      },
      error: (error) => {
        if (error.error.message === 'Account is inactive') {
          swal.fire({
            title: 'Thất bại!',
            text: 'Tài khoản đã bị vô hiệu hoá.',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-danger animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
        } else {
          swal.fire({
            title: 'Thất bại!',
            text: 'Tài khoản hoặc mật khẩu không chính xác.',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-danger animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
        }
        this.loginLoading = false;
      },
    });
  }

  loginGG() {
    this.authService
      .loginWithGoogle()
      .then((googleAuth) => {
        this.ggInfo = googleAuth.user.providerData['0'];
        googleAuth.user.getIdToken().then(
          (token) =>
            this.ngZone.run(() => {
              this.authService.loginWithToken(token).subscribe({
                next: (res) => {
                  this.setUser(res);
                  //da co tai khoan
                  if (res.user.name) {
                    this.brandService
                      .getBrandById(res.user.id)
                      .subscribe((brandRes) => {
                        if (brandRes.isNeedUpdatePassword) {
                          this.router.routeReuseStrategy.shouldReuseRoute =
                            function () {
                              return false;
                            };
                          this.router.onSameUrlNavigation = 'reload';
                          this.router.navigate(['/ho-so/doi-mat-khau'], {
                            queryParams: { isNeedUpdating: true },
                          });
                        } else {
                          swal.fire({
                            title: 'Thành công!',
                            text: 'Đăng nhập thành công.',
                            icon: 'success',
                            customClass: {
                              confirmButton:
                                'btn btn-success animation-on-hover',
                            },
                            buttonsStyling: false,
                            timer: 2000,
                          });
                          if (brandRes.status === 2) {
                            this.reloadService.routingReload(
                              '/mat-bang-cho-thue',
                              null
                            );
                          } else {
                            this.reloadService.routingReload('/mat-bang', null);
                          }
                        }
                      });
                  }
                  //Chua co, phai cap nhat
                  else {
                    this.brand = new Brand(null, false);
                    this.brand.id = res.user.id;
                    this.brand.firebaseUid = res.user.firebaseUid;
                    this.brand.email = this.ggInfo.email;
                    this.brand.name = this.ggInfo.displayName;
                    if (this.ggInfo.phoneNumber)
                      this.brand.phoneNumber = this.ggInfo.phoneNumber;
                    if (this.ggInfo.photoURL)
                      this.brand.avatarLink = this.ggInfo.photoURL;
                    this.isShowGoogle = true;
                  }
                },
                error: (error) => {
                  if (error.error.message === 'Account is inactive') {
                    swal.fire({
                      title: 'Thất bại!',
                      text: 'Tài khoản đã bị vô hiệu hoá.',
                      icon: 'error',
                      customClass: {
                        confirmButton: 'btn btn-danger animation-on-hover',
                      },
                      buttonsStyling: false,
                      timer: 2000,
                    });
                  } else {
                    swal.fire({
                      title: 'Thất bại!',
                      text: 'Vui lòng đăng nhập lại sau.',
                      icon: 'error',
                      customClass: {
                        confirmButton: 'btn btn-danger animation-on-hover',
                      },
                      buttonsStyling: false,
                      timer: 2000,
                    });
                    window.location.reload();
                  }
                },
              });
            }),
          (error) => {
            this.reloadService.routingReload('/trang-chu', null);
          }
        );
      })
      .catch((error) => {
        this.reloadService.routingReload('/trang-chu', null);
      });
  }

  openCreateAccount() {
    this.brand = new Brand(null, false);
    this.brand.userName = this.userNameSignUp;
    this.brand.password = this.passwordSignUp;

    this.brandService
      .getBrandByUserName(this.brand.userName.toLowerCase().trim())
      .subscribe((brands) => {
        if (brands.length > 0) {
          this.signUpForm
            .get('userNameSignUp')
            .setValidators([StringValidator.invalid()]);
          this.signUpForm.controls['userNameSignUp'].updateValueAndValidity();
          swal.fire({
            title: 'Cảnh báo!',
            text: 'Tài khoản đã tồn tại.',
            icon: 'warning',
            customClass: {
              confirmButton: 'btn btn-warning animation-on-hover',
            },
            buttonsStyling: false,
            timer: 2000,
          });
        } else {
          this.isShowUserPass = true;
        }
      });
  }

  onChangeUserName() {
    this.signUpForm.get('userNameSignUp').clearValidators();
    this.signUpForm
      .get('userNameSignUp')
      .setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]);
    this.signUpForm.controls['userNameSignUp'].updateValueAndValidity();
  }

  getStateCreateForm() {
    this.isShowGoogle = false;
  }

  getStateCreateWithUsernameForm() {
    this.isShowUserPass = false;
  }
}
