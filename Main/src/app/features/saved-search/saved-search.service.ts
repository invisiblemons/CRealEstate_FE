import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { Request } from './saved-search.model';

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {
  savedSearchURL: string = environment.apiUrl + '/brand-requests';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getSavedSearch(): Observable<any> {
    return this.httpClient.get<Request[]>(
      `${this.savedSearchURL}?MinStatus=1&OrderBy=2&PageSize=100&BrandId=${
        this.localStorageService.getUserObject().id
      }`
    );
  }
  getSavedSearchById(id): Observable<any> {
    return this.httpClient.get<Request>(
      `${this.savedSearchURL}/${id}`
    );
  }

  updateSavedSearch(request): Observable<any> {
    return this.httpClient.put<Request>(
      `${this.savedSearchURL}`, request
    );
  }
}
