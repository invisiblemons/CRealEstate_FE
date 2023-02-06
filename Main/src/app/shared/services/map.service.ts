/// <reference types="@types/google.maps" />
import { Injectable, NgZone } from '@angular/core';
import { loader } from '../constants/loader';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: google.maps.Map;
  constructor(private zone: NgZone) {}

  public getAddrComponent(place, componentTemplate) {
    let result;

    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

  public getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'long_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  public getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  public getWard(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_3: 'long_name' },
      ward = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    if (!ward) {
      const COMPONENT_TEMPLATE = { sublocality_level_1: 'long_name' },
        ward1 = this.getAddrComponent(place, COMPONENT_TEMPLATE);
      if (!ward1) {
        const COMPONENT_TEMPLATE = { sublocality: 'long_name' },
          ward2 = this.getAddrComponent(place, COMPONENT_TEMPLATE);
        if (!ward2) {
          const COMPONENT_TEMPLATE = { political: 'long_name' },
            ward3 = this.getAddrComponent(place, COMPONENT_TEMPLATE);
          return ward3;
        } else {
          return ward2;
        }
      } else {
        return ward1;
      }
    } else {
      return ward;
    }
  }

  public getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  public getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'long_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  public getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'long_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  public getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  public getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }

  public getPhone(place) {
    const COMPONENT_TEMPLATE = {
        formatted_phone_number: 'formatted_phone_number',
      },
      phone = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return phone;
  }
}
