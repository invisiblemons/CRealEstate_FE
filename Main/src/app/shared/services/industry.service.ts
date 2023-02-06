import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Industry } from '../models/industry.model';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  industryURL: string = environment.apiUrl + '/industries';
  constructor(private httpClient: HttpClient) { }

  public getIndustries(): Observable<any> {
    return this.httpClient.get<Industry[]>(`${this.industryURL}?OrderBy=8`);
  }
}