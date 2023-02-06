import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { Contract } from './contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  contractURL: string = environment.apiUrl + '/contracts';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getContracts(): Observable<any> {
    return this.httpClient.get<Contract[]>(
      `${this.contractURL}?MinStatus=1&BrandId=${
        this.localStorageService.getUserObject().id
      }&OrderBy=2&PageSize=100`
    );
  }

  getContractById(id): Observable<Contract> {
    return this.httpClient.get<Contract>(`${this.contractURL}/${id}`);
  }

  downFile(id): Observable<any> {
    return this.httpClient.get<any>(`${this.contractURL}/${id}/word-file`, {
      responseType: "blob" as "json",
    });
  }
}
