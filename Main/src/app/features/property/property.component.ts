import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { RADIUS } from 'src/app/shared/constants/constants';
import { GeoLocation } from 'src/app/shared/models/types-map/GeoLocation/geolocation-class';
import { Place } from 'src/app/shared/models/types-map/Place/place-class';
import { LocationService } from 'src/app/shared/services/location.service';
import { MapService } from 'src/app/shared/services/map.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { PropertyMapComponent } from './property-map/property-map.component';
import { Property } from './property.model';
import { PropertyService } from './property.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent implements OnInit {
  /*
  Fields of Component
  */

  properties: Property[];
  rawProperties: Property[];

  mainMarkerCircle: google.maps.Circle;
  map: google.maps.Map;
  location: GeoLocation;
  infoWindow: google.maps.InfoWindow;
  markers: google.maps.Marker[];
  place: any;
  places: Place[];
  service: any;
  geocoder: any;
  addressType: string;

  //format data
  address: Object;
  phone: string;
  formatted_address: string;

  isSelectedAddress: boolean;

  specificProperty: Property;

  loading: boolean = false;

  @ViewChild(FilterComponent) private filterComponent: FilterComponent;
  @ViewChild(PropertyMapComponent)
  private propertyMapComponent: PropertyMapComponent;
  constructor(
    private zone: NgZone,
    private propertyServices: PropertyService,
    private reloadService: ReloadRouteService,
    private localStorageService: LocalStorageService,
    private mapService: MapService,
    private locationServices: LocationService
  ) {
    this.addressType = 'geocode';
  }

  ngOnInit() {
    this.getProperties();
  }

  //Data Functions
  getProperties() {
    this.propertyServices.getProperties().subscribe((properties) => {
      this.properties = properties;
      this.rawProperties = properties;
    });
  }
  getSumarySearchFields(sumarySearchFields) {
    this.propertyServices
      .getPropertiesWithFilter(sumarySearchFields)
      .subscribe((properties) => {
        this.properties = properties;
        this.rawProperties = properties;
      });
  }
  showDialog(property) {
    if (this.localStorageService.getUserObject()) {
      if (this.localStorageService.getUserObject().status === 2) {
        this.reloadService.routingNotReload(
          '/mat-bang-cho-thue/chi-tiet',
          property.id
        );
      } else {
        this.reloadService.routingNotReload('/mat-bang/chi-tiet', property.id);
      }
    } else {
      this.reloadService.routingNotReload('/mat-bang/chi-tiet', property.id);
    }
  }

  showSpecificProperty(property) {
    this.specificProperty = property;
  }

  autocomplete() {
    // search input
    const searchInput = this.filterComponent.addressText.nativeElement;

    // Google Maps autocomplete
    const autocomplete = new google.maps.places.Autocomplete(searchInput, {
      strictBounds: true,
      componentRestrictions: { country: 'vn' },
      // 'establishment' / 'address' / 'geocode'
    });

    // Has user pressed the down key to navigate autocomplete options?
    let hasDownBeenPressed = false;
    let hasUpBeenPressed = false;

    // Listener outside to stop nested loop returning odd results
    searchInput.addEventListener('keydown', (e) => {
      if (e.keyCode === 40) {
        hasDownBeenPressed = true;
      }
      if (e.keyCode === 38) {
        hasUpBeenPressed = true;
      }
    });

    // GoogleMaps API custom eventlistener method
    searchInput.addEventListener('keydown', (e) => {
      e.cancelBubble = true;
      // If enter key, or tab key
      if (e.keyCode === 13 || e.keyCode === 9) {
        // If user isn't navigating using arrows and this hasn't ran yet
        if (!hasDownBeenPressed && !hasUpBeenPressed) {
          if (!e.hasRanOnce) {
            google.maps.event.trigger(e.target, 'keydown', {
              keyCode: 40,
              hasRanOnce: true,
            });
          }
        }
      }
    });

    // Clear the input on focus, reset hasDownBeenPressed
    searchInput.addEventListener('focus', () => {
      hasDownBeenPressed = false;
      hasUpBeenPressed = false;
      searchInput.value = '';
    });

    // place_changed GoogleMaps listener when we do submit
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Get the place info from the autocomplete Api
      const place = autocomplete.getPlace();

      //If we can find the place lets go to it
      if (typeof place.address_components !== 'undefined') {
        // reset hasDownBeenPressed in case they don't unfocus
        hasDownBeenPressed = false;
        hasUpBeenPressed = false;
        
        this.getSearchResProperties(
          this.mapService.getDistrict(place),
          this.mapService.getWard(place)
        );
        this.isSelectedAddress = true;
      }
    });
  }

  getAllProperties() {
    this.properties = this.rawProperties;
  }

  getSearchResProperties(district, ward) {
    this.loading = true;
    let propertiesTemp = [];
    this.locationServices
      .getDistrictByName(district)
      .subscribe((districtRes) => {
        if (districtRes.length > 0) {
          if (ward) {
            this.rawProperties.forEach((property) => {
              if (property.location.ward.districtId === districtRes[0].id) {
                if (
                  property.location.ward.name
                    .toLowerCase()
                    .includes(ward.toLowerCase())
                ) {
                  propertiesTemp.push(property);
                }
              }
            });
            if (propertiesTemp.length === 0) {
              this.rawProperties.forEach((property) => {
                if (property.location.ward.districtId === districtRes[0].id) {
                  propertiesTemp.push(property);
                }
              });
            }
          } else {
            this.rawProperties.forEach((property) => {
              if (property.location.ward.districtId === districtRes[0].id) {
                propertiesTemp.push(property);
              }
            });
          }
          if (propertiesTemp.length > 0) {
            this.properties = propertiesTemp;
            this.loading = false;
          } else {
            this.properties = [];
            this.loading = false;
          }
        } else {
          this.properties = [];
          this.loading = false;
        }
      });
  }

  getPlaces(): void {
    if (this.filterComponent.isAddressManuallyTyped) {
      this.getNewAddress();
      this.filterComponent.isAddressManuallyTyped = false;
    } else {
      this.map = this.propertyMapComponent.map;
      let request = {
        location: new google.maps.LatLng(
          this.location.geometry.location.lat,
          this.location.geometry.location.lng
        ),
        radius: RADIUS,
        type: this.filterComponent.selectedNameCategories,
      };
      this.service = new google.maps.places.PlacesService(this.map);
      this.service.nearbySearch(request, (results, status) =>
        this.zone.run(() => {
          this.callbackNearBySearch(results, status);
        })
      );
    }
  }
  callbackNearBySearch(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      this.places = [];
      for (var i = 0; i < results.length; i++) {
        this.places.push(this.getLatLngFromResponse(results[i]));
      }
      this.places = results;
      this.showPlacesOnMap();
      this.changeMapZoom(RADIUS);
    }
  }
  changeMapZoom(radius: number) {
    this.propertyMapComponent.fitCircleInMap(radius);
  }
  getNewAddress(): void {
    let request = {
      query: this.isSelectedAddress
        ? this.place.formatted_address
        : this.filterComponent.autocompleteInput,
      fields: ['geometry'],
    };
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, (results, status) =>
      this.zone.run(() => {
        this.callbackFindPlaceFromQuery(results, status);
      })
    );
  }
  callbackFindPlaceFromQuery(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      let latLng = new google.maps.LatLng(lat, lng);
      this.location = results[0];
      this.location.geometry.location = { lat: lat, lng: lng };
      this.propertyMapComponent.changeMainMarkerPosition(latLng);
      this.getPlaces();
    }
  }

  getLocationByPlaceId(placeId) {
    let request = {
      placeId: placeId,
      fields: ['name', 'rating', 'formatted_phone_number', 'geometry'],
    };
    this.map = this.propertyMapComponent.map;
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.getDetails(request, (results, status) =>
      this.zone.run(() => {
        this.callbackPlaceDetail(results, status);
      })
    );
  }
  callbackPlaceDetail(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.propertyMapComponent.place = results;
      this.propertyMapComponent.place = this.getLatLngFromResponse(results);
    }
  }

  getLatLngFromResponse(result): any {
    result.geometry.location = {
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
    };
    return result;
  }

  radiusSizeChange(value: number): void {
    this.propertyMapComponent.mainMarkerCircle.setRadius(value);
  }
  showCircleRadius(value: boolean): void {
    if (value) {
      this.propertyMapComponent.addCircleToMap(RADIUS);
    } else {
      this.propertyMapComponent.removeCircleFromMap();
    }
  }

  showPlacesOnMap(): void {
    this.propertyMapComponent.showPlaceMarkersOnMap(this.places);
  }

  //format data
  getAddress(place: object) {
    this.address = place['formatted_address'];
    this.phone = this.getPhone(place);
    this.formatted_address = place['formatted_address'];
  }

  //form autocomplete
  getAddrComponent(place, componentTemplate) {
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

  getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'short_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getCountryShort(place) {
    const COMPONENT_TEMPLATE = { country: 'short_name' },
      countryShort = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return countryShort;
  }

  getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }

  getPhone(place) {
    const COMPONENT_TEMPLATE = {
        formatted_phone_number: 'formatted_phone_number',
      },
      phone = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return phone;
  }
}
