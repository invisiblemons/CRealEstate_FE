import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { environment } from "src/environments/environment";

@Injectable()
export class JwtIntercepter implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.localStorage.getUserObject()) {
      const token = this.localStorage.getUserToken();
      const isOkUrl = request.url.startsWith(environment.apiUrl);

      if (token && isOkUrl) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
    return next.handle(request);
  }
}
