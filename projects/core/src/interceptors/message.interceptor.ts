import {Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "@dorbit";


@Injectable({providedIn: 'root'})
export class ErrorInterceptor implements HttpInterceptor {


  constructor(private injector: Injector, private messageService: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(e => {
      console.log(e)

      if(e instanceof HttpErrorResponse) {
        if(e.error?.message) {
          const translateService = this.injector.get(TranslateService);
          const key = `message.errors.${e.error.message}`;
          const message = translateService.instant(key);
          this.messageService.error(message);
        }
      }

      return throwError(() => e)
    }));
  }
}
