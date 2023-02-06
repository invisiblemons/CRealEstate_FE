import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request } from '../saved-search/saved-search.model';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {
  requestURL: string = environment.apiUrl + '/brand-requests';

  constructor(private httpClient: HttpClient) { }

  insertRequest(request: Request): Observable<Request>  {
    return this.httpClient.post<Request>(`${this.requestURL}`, request);
  }
}
