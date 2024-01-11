import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "../components/message/services/message.service";
import {Colors} from "../types";
import {Message} from "../components";


@Injectable({providedIn: 'root'})
export class MessageInterceptor implements HttpInterceptor {


  constructor(private injector: Injector, private messageService: MessageService) {
  }

  private send(text: string, color: Colors, message?: Message) {
    const translateService = this.injector.get(TranslateService);
    const key = `${text}`;
    const translate = translateService.instant(key);
    if (translate != key) {
      this.messageService.show({
        ...message,
        body: translate,
        color: color
      });
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(tap(e => {
      if (e instanceof HttpResponse) {
        if (e.ok) {
          if (e.body.message) {
            this.send(`message.${e.body.message}`, 'success');
          } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
            // this.send(`message.success`, 'success');
          }
        }
      }
    })).pipe(catchError(e => {
      if (e instanceof HttpErrorResponse) {
        if (e.error?.message) {
          this.send(`message.${e.error.message}`, 'danger');
        } else if (e.status == 504 || e.status == 0) {
          this.send(`message.http.504`, 'danger', {duration: 10000});
        } else {
          this.send(`message.error`, 'danger');
        }
      }

      return throwError(() => e)
    }));
  }
}
