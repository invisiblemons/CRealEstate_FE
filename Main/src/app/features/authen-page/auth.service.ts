import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from '../brand/brand.model';
import * as firebase from 'firebase/app';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL: string = environment.apiUrl + '/brands/authenticate';

  constructor(
    private httpClient: HttpClient,
    private angularFireAuth: AngularFireAuth,
  ) {}
  loginWithAccount(account): Observable<any> {
    return this.httpClient.post<Brand>(`${this.baseURL}`, account);
  }
  loginWithToken(token): Observable<any> {
    return this.httpClient.post<Brand>(`${this.baseURL}`, {"token":token});
  }
  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.angularFireAuth.auth.signInWithPopup(provider);
  }
  
}
