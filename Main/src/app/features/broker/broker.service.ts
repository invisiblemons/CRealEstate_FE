import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Broker } from './broker.model';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  brokerURL: string = environment.apiUrl + '/brokers';

  constructor(private httpClient: HttpClient) { }

  getBrokers(): Observable<any> {
    return this.httpClient.get<Broker[]>(`${this.brokerURL}?OrderBy=8&PageSize=100`);
  }

  getBrokerById(id): Observable<Broker> {
    return this.httpClient.get<Broker>(`${this.brokerURL}/${id}`);
  }
}
