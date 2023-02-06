import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { Store } from './store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  storeURL: string = environment.apiUrl + '/stores';

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) { }

  getStores(): Observable<any> {
    let id = this.localStorageService.getUserObject().id;
    return this.httpClient.get<Store[]>(`${this.storeURL}?OrderBy=2&PageSize=100&BrandId=${id}`);
  }

  getStoreById(id): Observable<Store> {
    return this.httpClient.get<Store>(`${this.storeURL}/${id}`);
  }

  deleteStore(id) {
    return this.httpClient.delete<Store>(`${this.storeURL}/${id}`);
  }

  insertStore(store: Store): Observable<Store>  {
    return this.httpClient.post<Store>(`${this.storeURL}`, store);
  }

  updateStore(store: Store): Observable<Store>  {
    return this.httpClient.put<Store>(`${this.storeURL}`, store);
  }
}
