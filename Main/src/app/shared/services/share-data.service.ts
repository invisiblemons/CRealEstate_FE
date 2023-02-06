import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/features/authen-page/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService{
  private subject = new Subject<any>();
  private authenSubject = new Subject<any>();

  constructor(private localStorageServices: LocalStorageService) {}

  lengthAfterAdding() {
    this.subject.next({
      lengthAppm: this.localStorageServices
        .getSpecificAppointment()
        .propertyArray.length.toString(),
    });
  }

  onLengthAppm(): Observable<any> {
    return this.subject.asObservable();
  }

  authenPageAfterRouting(value) {
    this.authenSubject.next({
      isLogin: value,isSignup: !value
    });
  }

  onAuthenPage(): Observable<any> {
    return this.authenSubject.asObservable();
  }

  heartAfterAdding(property) {
    this.subject.next({
      property: property,
    });
  }

  onHeartChange(): Observable<any> {
    return this.subject.asObservable();
  }
}
