import {HttpClient, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable, InjectionToken, Injector} from "@angular/core";
import {CacheService} from "./cache.service";
import {Observable, tap} from "rxjs";
import {LoadingService} from "./loading.service";

export const BASE_API_URL = new InjectionToken<string>('BASE_API_URL')

@Injectable({providedIn: 'root'})
export abstract class HttpService {
  protected http: CustomHttpClient;
  protected baseUrl: string;
  protected cacheService: CacheService;

  constructor(protected injector: Injector) {
    const handler = new CustomHttpHandler(
      injector.get(HttpHandler),
      injector.get(LoadingService),
    );
    this.http = new CustomHttpClient(handler);
    this.cacheService = injector.get(CacheService);
    this.baseUrl = injector.get(BASE_API_URL, '', {optional: true}) ?? '';
  }

  setLoadingService(service: LoadingService) {
    this.http.customHandler.loadingService = service;
  }
}

class CustomHttpHandler extends HttpHandler {

  constructor(private handler: HttpHandler, public loadingService: LoadingService) {
    super();
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    this.loadingService.startLoading();
    return this.handler.handle(req).pipe(tap({
      next: e => {
        if (e instanceof HttpResponse) {
          this.loadingService.endLoading();
        }
      },
      error: () => this.loadingService.endLoading()
    }));
  }

}

class CustomHttpClient extends HttpClient {

  public customHandler: CustomHttpHandler;

  constructor(handler: CustomHttpHandler) {
    super(handler);
    this.customHandler = handler;
  }

}
