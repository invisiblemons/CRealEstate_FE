import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Property } from './property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  propertyURL: string = environment.apiUrl + '/properties';

  constructor(private httpClient: HttpClient) {}

  getProperties(): Observable<any> {
    return this.httpClient.get<PropertyService[]>(`${this.propertyURL}?OrderBy=10&Status=2&PageSize=100`);
  }

  getPropertiesWithLocationId(locationId): Observable<any> {
    return this.httpClient.get<PropertyService[]>(`${this.propertyURL}?LocationId=${locationId}&OrderBy=10&Status=2&PageSize=100`);
  }

  getPropertiesWithFilter(sumarySearchFields): Observable<any> {
    return this.httpClient.get<PropertyService[]>(
      `${this.propertyURL}?OrderBy=10&Status=2&PageSize=100&MinPrice=${
        sumarySearchFields.rangePrice.length > 0
          ? sumarySearchFields.rangePrice[0]*1000000
          : ''
      }&MaxPrice=${
        sumarySearchFields.rangePrice.length > 0
          ? sumarySearchFields.rangePrice[1]*1000000
          : ''
      }&MinFloorArea=${
        sumarySearchFields.rangeArea.length > 0
          ? sumarySearchFields.rangeArea[0]
          : ''
      }&MaxFloorArea=${
        sumarySearchFields.rangeArea.length > 0
          ? sumarySearchFields.rangeArea[1]
          : ''
      }&Direction=${
        sumarySearchFields.selectedDirections
        &&sumarySearchFields.selectedDirections.length > 0
          ? sumarySearchFields.selectedDirections[0]
          : ''
      }&Floor=${
        sumarySearchFields.selectedFloors
        &&sumarySearchFields.selectedFloors.length > 0
          ? sumarySearchFields.selectedFloors[0]
          : ''
      }`
    );
  }

  getPropertiesWithFilterFromRequest(sumarySearchFields): Observable<any> {
    return this.httpClient.get<PropertyService[]>(
      `${this.propertyURL}?OrderBy=10&Status=2&PageSize=100&MinPrice=${
        sumarySearchFields.rangePrice.length > 0
          ? sumarySearchFields.rangePrice[0]*1000000
          : ''
      }&MaxPrice=${
        sumarySearchFields.rangePrice.length > 0
          ? sumarySearchFields.rangePrice[1]*1000000
          : ''
      }&MinFloorArea=${
        sumarySearchFields.rangeArea.length > 0
          ? sumarySearchFields.rangeArea[0]
          : ''
      }&MaxFloorArea=${
        sumarySearchFields.rangeArea.length > 0
          ? sumarySearchFields.rangeArea[1]
          : ''
      }&NumberOfFrontage=${
        sumarySearchFields.numberOfFrontage
          ? sumarySearchFields.numberOfFrontage
          : ''
      }`
    );
  }

  getPropertiesWithSort(selectedFilter): Observable<any> {
    return this.httpClient.get<PropertyService[]>(
      `${this.propertyURL}${selectedFilter}&OrderBy=10&Status=2&PageSize=100`
    );
  }

  getPropertyById(id): Observable<Property> {
    return this.httpClient.get<Property>(`${this.propertyURL}/${id}`);
  }
}
