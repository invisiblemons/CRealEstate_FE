import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from './brand.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  brandURL: string = environment.apiUrl + '/brands';

  constructor(private httpClient: HttpClient) {}

  getBrandById(id): Observable<Brand> {
    return this.httpClient.get<Brand>(`${this.brandURL}/${id}`);
  }

  getBrandByUserName(userName): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(
      `${this.brandURL}?UserName=${userName}&OrderBy=2`
    );
  }
  getBrandByEmail(email): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(
      `${this.brandURL}?Email=${email}&OrderBy=2`
    );
  }
  getBrandByPhone(phone): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(
      `${this.brandURL}?PhoneNumber=${phone}&OrderBy=2`
    );
  }

  updateBrand(brand): Observable<any> {
    return this.httpClient.put<Brand>(`${this.brandURL}/profile`, brand);
  }

  createBrand(brand): Observable<any> {
    return this.httpClient.post<Brand>(`${this.brandURL}`, brand);
  }

  updateBrandAvatar( file): Observable<Brand> {
    return this.httpClient.put<Brand>(`${this.brandURL}/profile/avatar`, file);
  }

  updateBrandPassword(objectPassword): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<Brand>(
      `${this.brandURL}/profile/password`,
      objectPassword,
      { headers }
    );
  }

  resetPassword(email): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<Brand>(
      `${this.brandURL}/reset-password`,
      JSON.stringify(email),
      { headers }
    );
  }
}
