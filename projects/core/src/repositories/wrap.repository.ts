import {InjectionToken, Injector} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {pipe, tap} from "rxjs";
import {BASE_API_URL, QueryResult} from "@framework";

type Options = {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?: {
    includeHeaders?: string[];
  } | boolean;
};

export abstract class WrapRepository {
  protected http: HttpClient;
  protected messageService: MessageService;
  protected baseUrl: string;

  protected successMessagePipe = pipe(tap({
    next: res => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Operation done successfully.'});
    },
    error: err => {
    }
  }));

  protected errorMessagePipe = pipe(tap({
    next: res => {
    },
    error: err => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Operation failed.'});
    }
  }));

  constructor(protected injector: Injector, protected repository: string, baseUrl?: string) {
    this.http = injector.get(HttpClient);
    this.messageService = injector.get(MessageService);
    this.baseUrl = baseUrl ?? injector.get(BASE_API_URL);
  }

  createUrl(url: string) {
    if (url.startsWith('http')) return url;
    return this.baseUrl + (this.baseUrl.endsWith('/') ? '' : '/') + (this.repository ? this.repository + '/' : '') + url;
  }

  get<T>(url: string, options?: Options) {
    return this.http.get<T>(this.createUrl(url), options).pipe(this.errorMessagePipe);
  }

  post<T>(url: string, data: any, options?: Options) {
    return this.http.post<T>(this.createUrl(url), data, options).pipe(this.errorMessagePipe).pipe(this.successMessagePipe);
  }

  patch<T>(url: string, data: any, options?: Options) {
    return this.http.patch<T>(this.createUrl(url), data, options).pipe(this.errorMessagePipe).pipe(this.successMessagePipe);
  }

  put<T>(url: string, data: any, options?: Options) {
    return this.http.put<T>(this.createUrl(url), data, options).pipe(this.errorMessagePipe).pipe(this.successMessagePipe);
  }

  delete<T>(url: string, options?: Options) {
    return this.http.delete<T>(this.createUrl(url), options).pipe(this.errorMessagePipe).pipe(this.successMessagePipe);
  }
}
