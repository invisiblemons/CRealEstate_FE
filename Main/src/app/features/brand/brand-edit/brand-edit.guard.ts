import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { BrandEditComponent } from './brand-edit.component';


@Injectable({
  providedIn: 'root'
})
export class BrandEditGuard implements CanDeactivate<BrandEditComponent> {
  canDeactivate(component: BrandEditComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.brandForm.dirty) {
      const name = component.brandForm.get('name')?.value || 'New Brand';
      return confirm(`bạn có chắc muốn thoát khỏi chỉnh sửa hồ sơ?`);
    }
    return true;
  }
}

