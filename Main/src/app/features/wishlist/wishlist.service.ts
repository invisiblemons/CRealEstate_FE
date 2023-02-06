import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { Wishlist } from './wishlist.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistURL: string = environment.apiUrl + '/brands/marked-property';
  propertyBrandURL: string = environment.apiUrl + '/property_brands';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getWishlist(): Observable<any> {
    return this.httpClient.get<Wishlist[]>(
      `${this.propertyBrandURL}?OrderBy=4&ListType=2&ListType=3&PageSize=100&BrandId=${
        this.localStorageService.getUserObject().id
      }`
    );
  }

  getWishlistById(propertyId, brandId): Observable<any> {
    return this.httpClient.get<Wishlist>(
      `${this.propertyBrandURL}?OrderBy=4&ListType=1&ListType=2&ListType=3&PropertyId=${propertyId}&BrandId=${brandId}`
    );
  }

  getSuggests(): Observable<any> {
    return this.httpClient.get<Wishlist[]>(
      `${this.propertyBrandURL}?OrderBy=4&ListType=1&ListType=3&PageSize=100&BrandId=${
        this.localStorageService.getUserObject().id
      }`
    );
  }

  deleteWishlist(propertyIdList: number[]) {
    const options = {
      headers: new HttpHeaders(),
      body: propertyIdList,
    };
    return this.httpClient.delete<any>(`${this.wishlistURL}`, options);
  }

  insertWishlist(propertyIdList: number[]): Observable<Wishlist> {
    return this.httpClient.post<Wishlist>(
      `${this.wishlistURL}`,
      propertyIdList
    );
  }
}
