import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { loader, STYLE_MAP } from 'src/app/shared/constants/loader';
import { Location } from 'src/app/shared/models/location.model';
import { StreetSegment } from 'src/app/shared/models/streetSegment.model';
import { Place } from 'src/app/shared/models/types-map/Place/place-class';
import { Ward } from 'src/app/shared/models/ward.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { Property } from '../property.model';
import { PropertyService } from '../property.service';

@Component({
  selector: 'app-property-map',
  templateUrl: './property-map.component.html',
  styleUrls: ['./property-map.component.scss'],
  host: { class: 'customClass' },
})
export class PropertyMapComponent implements OnInit, OnDestroy {
  destroySubs$: Subject<boolean> = new Subject<boolean>();
  map: google.maps.Map;
  // mainMarker: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow;
  mainMarkerCircle: google.maps.Circle;
  place: any;
  latLnglocation: any;
  @Output() getLocationByPlaceId = new EventEmitter<string>();

  properties: Property[];
  @Input() propertiesData: Property[];
  @Input() specificProperty: Property;

  @Output() showDialog = new EventEmitter<Property>();

  property: Property;

  index: number;

  constructor(
    private propertyServices: PropertyService,
    private locationServices: LocationService
  ) {}
  ngOnInit() {
    /**
     * Creates an instance of map
     */
    const pos = {
      lat: 10.82199563346198,
      lng: 106.76400477353342,
    };
    loader.load().then(() => {
      this.map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: {
            lat: pos.lat,
            lng: pos.lng,
          },
          zoom: 13,
        }
      );
      this.map.setOptions({ styles: STYLE_MAP });
      this.showMainCenter(pos);
      this.createMainMarkerCircle();
      this.getLocationByPlaceId.emit('ChIJ0T2NLikpdTERKxE8d61aX_E');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['propertiesData'] && changes['propertiesData'].currentValue) {
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.properties = changes['propertiesData'].currentValue;
      if (this.properties.length > 0) {
        this.properties.forEach((property) => {
          const marker = this.createMarker(property.location);
          const infoWindow = this.createPopupWindow(property);
          this.property = property;
          this.addClickEventToMarker(marker, infoWindow);
          bounds.extend(marker.getPosition());
        });
      } else {
        this.properties = [];
      }
      this.map.fitBounds(bounds);
    }
    if (
      changes['specificProperty'] &&
      changes['specificProperty'].currentValue
    ) {
      if (
        this.specificProperty &&
        this.specificProperty.id === changes['specificProperty'].currentValue.id
      ) {
        google.maps.event.trigger(this.markers[this.index], 'mouseout');
        this.markers.forEach((marker) => {
          google.maps.event.trigger(marker, 'mouseout');
        });
      }
      this.specificProperty = changes['specificProperty'].currentValue;
      this.markers.forEach((marker) => {
        if (
          marker.getPosition().lat() ==
            this.specificProperty.location.latitude &&
          marker.getPosition().lng() == this.specificProperty.location.longitude
        ) {
          google.maps.event.trigger(marker, 'mouseover');
        }
      });
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  // initMap(): void {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         loader.load().then(() => {
  //           this.map = new google.maps.Map(document.getElementById('map'), {
  //             center: {
  //               lat: position.coords.latitude,
  //               lng: position.coords.longitude,
  //             },
  //             zoom: 15,
  //           });
  //           this.map.setOptions({ styles: STYLE_MAP });

  //           this.showMainMarker(pos);
  //           this.createMainMarkerCircle();
  //           this.latLnglocation = {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //           };
  //           this.getGeoLocation();
  //         });

  // }
  createMarker(location: Location): google.maps.Marker {
    var icon = {
      url: 'assets/img/marker.svg',
      fillColor: '#2576BB',
      fillOpacity: 1,
      scaledSize: new google.maps.Size(50, 50), // scaled size
      strokeColor: '#2576BB',
      strokeWeight: 2,
      anchor: new google.maps.Point(30, 50),
    };
    const pos = {
      lat: location.latitude,
      lng: location.longitude,
    };

    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: false,
      icon: icon,
      animation: google.maps.Animation.DROP,
    });
    this.markers.push(marker);
    return marker;
  }
  createPopupWindow(property): google.maps.InfoWindow {
    let images = [];
    property.media.forEach((image) => {
      if (image.type === 1) {
        images.push(image);
      }
    });

    property.mainImage = images[0];

    return new google.maps.InfoWindow({
      content:
        '<div class="card-preview">' +
        '<a>' +
        '<img class="img-preview" src=' +
        property.mainImage.link +
        ' />' +
        '<div class="card-preview-content my-2">' +
        '<i class="pi pi-money-bill"></i> ' +
        '<strong>' +
        (property.price / 1000000).toLocaleString('vi') +
        ' triệu/tháng' +
        '</strong>' +
        '<span class="vl" ></span>' +
        '<i class="pi pi-sort"></i> ' +
        '<strong>' +
        property.floorArea +
        'm²</strong>' +
        '</div>' +
        '</a>' +
        '</div>',
    });
  }
  /**
   * Change the position of  marker that indicates location  on the map
   */
  changeMainMarkerPosition(latLng: google.maps.LatLng): void {
    this.map.setCenter(latLng);
  }
  /**
   * Show the marker that indicates location  on the map
   */
  showMainCenter(pos: { lat: number; lng: number }): void {
    let latLng = new google.maps.LatLng(pos.lat, pos.lng);
    this.map.setCenter(latLng);
  }
  /**
   * Creates an instance of marker circle but does not show it on the map
   */
  createMainMarkerCircle(): void {
    this.mainMarkerCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.08,
      map: null,
      center: null,
      radius: null,
    });
  }
  handleLocationError(
    browserHasGeolocation: boolean,
    pos: google.maps.LatLng
  ): void {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
    this.infoWindow.open(this.map);
  }
  /**
   * Show the marker that indicates places on the map
   */
  showPlaceMarkersOnMap(places: Place[]) {
    this.removePreviousMarkersFromMap();
    // this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
    places.forEach((place) => {
      const marker = this.createMarkerForPlace(place);
      const infoWindow = this.createInfoWindow(place);
      this.addClickEventToMarker(marker, infoWindow);
    });
  }
  addClickEventToMarker(
    marker: google.maps.Marker,
    infoWindow: google.maps.InfoWindow
  ): void {
    var clicked = false;
    marker.addListener('click', () => {
      if (clicked) {
        infoWindow.close();
      } else {
        this.showDialog.emit(this.property);
        infoWindow.open(this.map, marker);
      }
    });
    marker.addListener('mouseover', () => {
      infoWindow.open(this.map, marker);
    });
    marker.addListener('mouseout', () => {
      infoWindow.close();
    });
  }
  /**
   * Create info windows for  all places
   * @param place
   */
  createInfoWindow(place: Place): google.maps.InfoWindow {
    return new google.maps.InfoWindow({
      content: '<h1>' + place.name + '</h1> <h2>' + place.vicinity + '</h2> ',
    });
  }
  /**
   * Show the markers of all places
   * @param place
   */
  createMarkerForPlace(place: Place): google.maps.Marker {
    var icon = {
      url: 'assets/img/marker.png', // url "../assets/img/marker.png" 'https://i.ibb.co/vmz0WBJ/marker.png'
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(30, 50),
    };
    const pos = {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    };

    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: false,
      icon: icon,
      animation: google.maps.Animation.DROP,
    });
    this.markers.push(marker);
    return marker;
  }
  /**
   * Removes all markers on the map
   */
  removePreviousMarkersFromMap(): void {
    if (this.markers.length != 0) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
  }
  addCircleToMap(radius: number) {
    this.mainMarkerCircle.setMap(this.map);
    this.mainMarkerCircle.setRadius(radius);
    // this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
  }
  removeCircleFromMap() {
    this.mainMarkerCircle.setMap(null);
    this.mainMarkerCircle.setRadius(null);
    this.mainMarkerCircle.setCenter(null);
  }

  fitCircleInMap(radius: number) {
    this.map.fitBounds(this.mainMarkerCircle.getBounds());
    /*
    if (radius < 15) {
      this.map.setZoom(21);
    }
    if (radius >= 15) {
      this.map.setZoom(20);
    }
    if (radius > 30) {
      this.map.setZoom(19);
    }
    if (radius > 70) {
      this.map.setZoom(18);
    }
    if (radius > 130) {
      this.map.setZoom(17);
    }
    if (radius > 270) {
      this.map.setZoom(16);
    }
    if (radius > 500) {
      this.map.setZoom(15);
    }
    if (radius > 1000) {
      this.map.setZoom(14);
    }
    if (radius > 2000) {
      this.map.setZoom(13);
    }
    if (radius > 4200) {
      this.map.setZoom(12);
    }
    if (radius > 8000) {
      this.map.setZoom(11);
    }
    if (radius > 16000) {
      this.map.setZoom(10);
    }
    if (radius > 32000 && radius <= 50000) {
      this.map.setZoom(9);
    }
    */
  }
}
