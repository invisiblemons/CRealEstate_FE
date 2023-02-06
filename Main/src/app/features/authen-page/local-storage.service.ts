import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Brand } from '../brand/brand.model';
import { BrandService } from '../brand/brand.service';
import { Property } from '../property/property.model';

const AUTH = 'authenticate';
const APPM = 'appointment';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private brandService: BrandService) {}

  /*
  User
  */
  setUser(authenticate) {
    localStorage.setItem(AUTH, JSON.stringify(authenticate));
  }

  getUser() {
    let auth = JSON.parse(localStorage.getItem(AUTH));
    return auth ? auth : null;
  }

  getUserToken(): string {
    let auth = JSON.parse(localStorage.getItem(AUTH));
    return auth ? auth['token'] : null;
  }

  setUserObject(object) {
    let user = this.getUser();
    user.user = object;
    localStorage.setItem(AUTH, JSON.stringify(user));
  }

  getUserObject(): Brand {
    let auth = JSON.parse(localStorage.getItem(AUTH));
    return auth ? auth['user'] : null;
  }

  removeUser() {
    return localStorage.removeItem(AUTH);
  }

  /*
  Appointment
  */
  setNewAppointment(property) {
    let appms = this.getAppointmentsFromLocal();
    //had appointment in local storage of client
    if (appms) {
      //not had appm of current user
      if (property === '') {
        appms.push({ id: this.getUserObject().id, propertyArray: [] });
        localStorage.setItem(APPM, JSON.stringify(appms));
      }
      // had appm of current user, then add new property to this appm
      else {
        let propertyArray = this.getSpecificAppointment().propertyArray;

        if (propertyArray.length !== 0) propertyArray.push(property);
        else propertyArray = [property];

        this.setPropertiesArrayIntoAppointment(appms, propertyArray);
      }
    }
    // not had appointment in local storage of client
    else {
      localStorage.setItem(
        APPM,
        JSON.stringify([{ id: this.getUserObject().id, propertyArray: [] }])
      );
    }
  }

  setPropertiesArrayIntoAppointment(appoitmentList, propertiesArray) {
    appoitmentList.forEach((item) => {
      if (item.id === this.getUserObject().id) {
        item.propertyArray = propertiesArray;
      }
    });
    localStorage.setItem(APPM, JSON.stringify(appoitmentList));
  }
  deletePropertyInAppointment(property): Property[] {
    let appms = this.getAppointmentsFromLocal();
    let propertyArray = this.getSpecificAppointment().propertyArray;
    propertyArray = propertyArray.filter((item) => item.id !== property.id);
    this.setPropertiesArrayIntoAppointment(appms, propertyArray);
    return propertyArray;
  }
  deleteAllPropertiesInAppointment() {
    let appms = this.getAppointmentsFromLocal();
    appms.forEach((item) => {
      if (item.id === this.getUserObject().id) {
        item.propertyArray = [];
      }
    });
    localStorage.setItem(APPM, JSON.stringify(appms));
  }
  getAppointmentsFromLocal(): any {
    return JSON.parse(localStorage.getItem(APPM));
  }
  getSpecificAppointment(): { id; propertyArray } {
    let res = null;
    let appms = this.getAppointmentsFromLocal();
    if (appms) {
      appms.forEach((appm) => {
        if (this.getUserObject().id === appm.id) {
          res = appm;
        }
      });
    }
    return res;
  }
}
