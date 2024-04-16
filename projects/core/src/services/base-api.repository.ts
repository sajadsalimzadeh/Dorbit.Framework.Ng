import {HttpClient, HttpContext, HttpEvent, HttpHandler, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable, InjectionToken, Injector} from "@angular/core";
import {finalize, Observable, tap} from "rxjs";
import {LoadingService} from "./loading.service";

export const BASE_API_URL = new InjectionToken<string>('BASE_API_URL');

export interface HttpOptions {
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
}

@Injectable()
export abstract class BaseApiRepository {

  protected http: CustomHttpClient;

  public readonly baseUrl: string;
  public readonly repository: string;
  public loadingService: LoadingService;

  protected constructor(protected injector: Injector, repository?: string, baseUrl?: string) {
    this.baseUrl = baseUrl ?? injector.get(BASE_API_URL, '', {optional: true}) ?? '';
    this.repository = repository ?? '';
    this.loadingService = injector.get(LoadingService);
    const handler = new CustomHttpHandler(this, injector.get(HttpHandler));
    this.http = new CustomHttpClient(handler);
  }

  getUrl(url: string) {
    return `${this.baseUrl}${(this.baseUrl.endsWith('/') ? '' : '/')}${this.repository}/${url}`;
  }
}

class CustomHttpHandler extends HttpHandler {

  constructor(private api: BaseApiRepository, private handler: HttpHandler) {
    super();
  }

  override handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {

    if (!req.url.startsWith('http')) {

      let url = req.url;
      if (url.startsWith('$')) {
        url = url.substring(1);
      } else {
        let baseUrl = this.api.baseUrl;
        if (url.startsWith('~')) {
          url = url.substring(1);
        } else if (this.api.repository) {
          baseUrl += (baseUrl.endsWith('/') ? '' : '/') + this.api.repository;
        }
        if (!baseUrl.endsWith('/')) baseUrl += '/';
        url = baseUrl + url;

        if (url.endsWith('/')) url = url.substring(0, url.length - 1);
      }

      req = req.clone({
        url: url
      });
    }

    this.api.loadingService.start();
    const timeout = setTimeout(() => {
      this.api.loadingService.end();
    }, 120000);

    return this.handler.handle(req).pipe(finalize(() => {
      clearTimeout(timeout);
      this.api.loadingService.end();
    }));
  }

}

class CustomHttpClient extends HttpClient {
  private customHandler: CustomHttpHandler;

  constructor(handler: CustomHttpHandler) {
    super(handler);
    this.customHandler = handler;
  }

}
