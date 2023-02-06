import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  fromEvent,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { Industry } from 'src/app/shared/models/industry.model';
import { GenericValidator } from 'src/app/shared/validator/generic-validator';
import { Brand } from '../../brand/brand.model';
import { BrandService } from '../../brand/brand.service';
import swal from 'sweetalert2';
import { LocalStorageService } from '../local-storage.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { StringValidator } from 'src/app/shared/validator/string-validator';
import { EMAIL_PATTERN } from 'src/app/shared/constants/common.const';

@Component({
  selector: 'app-create-by-google',
  templateUrl: './create-by-google.component.html',
  styleUrls: ['./create-by-google.component.scss'],
})
export class CreateByGoogleComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  industries: Industry[];
  selectedIndustry: Industry;
  loading: boolean = false;
  @Input() brand: Brand;
  //validate
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  updateForm!: FormGroup;
  errorMessage = '';
  editorValueType: string;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  isShowDialog: boolean = true;

  //image
  avatarFile: File;
  changedImg: boolean;

  @Output() stateCreateForm = new EventEmitter(); 

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private localStorageService: LocalStorageService,
    private reloadService: ReloadRouteService,
    private industryService: IndustryService
  ) {
    //validate
    this.validationMessages = {
      name: {
        required: 'Tên không được để trống.',
        minlength: 'Tên phải có ít nhất 3 kí tự.',
        maxlength: 'Tên có nhiều nhất 100 kí tự.',
      },
      email: {
        required: 'Địa chỉ email không được để trống.',
        pattern: 'Địa chỉ email không hợp lệ',
        invalid: 'Địa chỉ email đã tồn tại',
      },
      industry: {
        required: 'Ngành kinh doanh không được để trống.',
      },
      phoneNumber: {
        required: 'Số điện thoại không được để trống.',
        invalid: 'Số điện thoại đã tồn tại',
      },
      registrationNumber: {
        required: 'Mã số doanh nghiệp được để trống.',
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      industry: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['brand'].currentValue) {
      this.brand = changes['brand'].currentValue;
    }
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.updateForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(
          this.updateForm
        );
      });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('authen-page');
  }

  updateUser() {
    this.loading = true;
    this.brand.industryId = this.selectedIndustry.id;
    this.brand.registrationNumber = this.brand.registrationNumber.toString();
    if (this.brand.phoneNumber.includes(' ')) {
      let phoneArr = this.brand.phoneNumber.split(' ');
      this.brand.phoneNumber = phoneArr[0] + phoneArr[1] + phoneArr[2];
    }
    this.brand.status = 1;
    this.brand = new Brand(this.brand, true);
    this.brandService
      .updateBrand(this.brand)
      .pipe(
        switchMap((brand: Brand) => {
          //update image
          if (this.changedImg && this.avatarFile) {
            let formData: FormData = new FormData();
            formData.append('file', this.avatarFile);
            return this.brandService.updateBrandAvatar(formData);
          } else return of(brand);
        })
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          swal.fire({
            title: 'Thành công!',
            text: 'Tạo mới tài khoản thành công.',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-success animation-on-hover',
            },
            buttonsStyling: false,
            timer: 1000,
          });
          this.localStorageService.setUserObject(res);
          if (res.status === 2) {
            this.reloadService.routingReload('/mat-bang-cho-thue', null);
          } else {
            this.reloadService.routingReload('/mat-bang', null);
          }
        },
        error: (error) => {
          if (error.error.message === 'UserName is already exist') {
            this.updateForm
              .get('userName')
              .setValidators([StringValidator.invalid()]);
            this.updateForm.controls['userName'].updateValueAndValidity();
          }
          else if (error.error.message === 'Email is already exist') {
            this.updateForm
              .get('email')
              .setValidators([StringValidator.invalid()]);
            this.updateForm.controls['email'].updateValueAndValidity();
          }
          else if (error.error.message === 'PhoneNumber is already exist') {
            this.updateForm
              .get('phoneNumber')
              .setValidators([StringValidator.invalid()]);
            this.updateForm.controls['phoneNumber'].updateValueAndValidity();
          } else {
            swal.fire({
              title: 'Thất bại!',
              text: 'Tạo mới tài khoản thất bại vui lòng thử lại.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-info animation-on-hover',
              },
              buttonsStyling: false,
              timer: 2000,
            });
          }

          this.loading = false;
        },
      });
  }

  onChangeUserName() {
    this.updateForm
      .get('userName')
      .setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]);
    this.updateForm.controls['userName'].updateValueAndValidity();
  }
  onChangeEmail() {
    this.updateForm
      .get('email')
      .setValidators([Validators.required, Validators.pattern(EMAIL_PATTERN)]);
    this.updateForm.controls['email'].updateValueAndValidity();
  }
  onChangePhone() {
    this.updateForm.get('phoneNumber').setValidators([Validators.required]);
    this.updateForm.controls['phoneNumber'].updateValueAndValidity();
  }

  loadIndustries() {
    this.industryService.getIndustries().subscribe((res) => {
      this.industries = res;
    });
  }

  // Image Function
  getImgFromChild(imgFile) {
    this.avatarFile = imgFile;
    this.changedImg = true;
  }

  hideDialog() {
    this.stateCreateForm.emit();
  }

}
