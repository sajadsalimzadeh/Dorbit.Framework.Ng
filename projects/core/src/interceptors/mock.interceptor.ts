import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

export const MOCK_DATA = new InjectionToken('Mock data');

export interface MockData {
  url: string;
  method: string;
  data: any;
}

@Injectable({providedIn: 'root'})
export class MockInterceptor implements HttpInterceptor {


  constructor(@Inject(MOCK_DATA) @Optional() private mocks: MockData[]) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(this.mocks) {
      for (const mock of this.mocks) {

        if (req.method.toLowerCase() == mock.method.toLowerCase()) {
          const urlMatch = req.url.match(mock.url);
          if (urlMatch && urlMatch.length > 0) {
            return new Observable(ob => {
              setTimeout(() => ob.next(new HttpResponse({body: mock.data, url: req.url, status: 200, statusText: 'OK'})), 100);
            });
          }
        }
      }
    }

    return next.handle(req);
  }
}
