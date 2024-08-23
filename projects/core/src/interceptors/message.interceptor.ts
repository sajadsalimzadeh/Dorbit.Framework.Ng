import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import {Message, MessageService} from "../components";
import {Colors} from "../types";

@Injectable({providedIn: 'root'})
export class MessageInterceptor implements HttpInterceptor {
  translateService?: TranslateService;

  constructor(private injector: Injector, private messageService: MessageService) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.get('message') != 'disable') {
      return next.handle(req);
    }

    return next.handle(req);
  }
}
