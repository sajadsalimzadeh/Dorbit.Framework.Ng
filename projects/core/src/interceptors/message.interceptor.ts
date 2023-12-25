import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "../components/message/services/message.service";


@Injectable({providedIn: 'root'})
export class MessageInterceptor implements HttpInterceptor {


  constructor(private injector: Injector, private messageService: MessageService) {
  }

  private translate(text: string) {
    const translateService = this.injector.get(TranslateService);
    const key = `${text}`;
    return translateService.instant(key);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(tap(e => {
      if (e instanceof HttpResponse) {
        if (e.ok) {
          if (e.body.message) {
            this.messageService.success(this.translate(`message.errors.${e.body.message}`));
          }
          else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
            this.messageService.success(this.translate(`message.success`));
          }
        }
      }
    })).pipe(catchError(e => {
      if (e instanceof HttpErrorResponse) {
        if (e.error?.message) {
          this.messageService.error(this.translate(`message.errors.${e.error.message}`));
        }
      }

      return throwError(() => e)
    }));
  }
}
