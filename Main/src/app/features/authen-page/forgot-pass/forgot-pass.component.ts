import { Component, OnInit } from '@angular/core';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { BrandService } from '../../brand/brand.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss'],
})
export class ForgotPassComponent implements OnInit {
  email: string;
  focus;
  constructor(
    private brandService: BrandService,
    private reloadService: ReloadRouteService
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('reset-page');
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('reset-page');
  }

  resetPassword() {
    this.brandService.resetPassword(this.email).subscribe({
      next: (brand) => {
        this.reloadService.routingReload('/xac-thuc', null);
        swal.fire({
          title: 'Thành công!',
          text: 'Đổi mật khẩu thành công. Kiểm tra địa chỉ email để lấy mật khẩu mới.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success animation-on-hover',
          },
          buttonsStyling: false,
          timer: 2000,
        });
      },
      error: (error) => {
        swal.fire({
          title: 'Địa chỉ email không tồn tại!',
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
