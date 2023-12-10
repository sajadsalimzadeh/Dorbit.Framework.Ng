import {Inject, Injectable, InjectionToken, isDevMode, Optional} from '@angular/core';
import {HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TimeSpan} from "../contracts";
import {internetStateService} from "../services/internet-state.service";
import {CacheService, IndexDbStorage, IStorage} from "../services";
import {delay} from "../utils";
import {APP_VERSION} from "../types";

export interface HttpCacheBase {
  url: RegExp | string;
  methods: string[],
  ifOffline?: boolean;
  withVersion?: boolean;
  production?: boolean;
  ifBody?: (body: any) => boolean;
}

export interface HttpCache extends HttpCacheBase {
  storage?: IStorage;
  timeout?: TimeSpan;
  evictions?: HttpCacheBase[]
}

interface HttpCacheExtended extends HttpCache {
  storage: IStorage;
}

export const HTTP_CACHE = new InjectionToken<HttpCache[]>('Http Cache');
export const HTTP_CACHE_STORAGE = new InjectionToken<IStorage>('Http Cache Storage');


@Injectable({providedIn: 'root'})
export class CacheInterceptor implements HttpInterceptor {
  private cacheService: CacheService = new CacheService();

  private readonly matchItems: (HttpCacheBase & { isEviction: boolean, httpCache: HttpCacheExtended })[] = [];

  constructor(
    @Inject(APP_VERSION) @Optional() appVersion: string,
    @Inject(HTTP_CACHE) private readonly httpCaches: HttpCacheExtended[],
    @Inject(HTTP_CACHE_STORAGE) @Optional() storage: IStorage) {
    this.cacheService.version = appVersion ?? '0.0.0';
    storage ??= new IndexDbStorage({prefix: 'cache-http-'});
    httpCaches.forEach(x => x.storage ??= storage)
    httpCaches.forEach(x => {
      for (let i = 0; i < x.methods.length; i++) {
        x.methods[i] = x.methods[i].toLowerCase();
      }
      this.matchItems.push({
        ...x,
        isEviction: false,
        httpCache: x,
      });
      x.evictions?.forEach(e => {
        this.matchItems.push({
          ...e,
          isEviction: true,
          httpCache: x,
        });
      })
    });

    this.httpCaches = httpCaches.map(x => ({
      ...x,
      storage: x.storage ?? storage
    }));
  }

  subscriberGroups: { [key: string]: boolean } = {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return new Observable<HttpEvent<any>>(ob => {
        setTimeout(async () => {
          const method = req.method.toLowerCase();
          const matchCaches = this.matchItems.filter(x => {
            if (!x.methods.includes(method)) return false;
            if (typeof x.url === 'string') return req.url.includes(x.url);
            if (x.production && isDevMode()) return false;
            return x.url.test(req.url);
          });
          for (const matchCache of matchCaches) {
            const httpCache = matchCache.httpCache;
            const key = req.url;

            if (matchCache.isEviction) {
              await this.cacheService.remove(key, httpCache.storage);
            } else {

              while (this.subscriberGroups[key]) {
                await delay(50);
              }
              this.subscriberGroups[key] = true;

              const isOffline = !internetStateService.$status.value;
              const cache = await this.cacheService.get(key, httpCache.storage, {
                ignoreExpiration: isOffline,
                ignoreVersion: isOffline,
              });
              if (cache && (isOffline || !matchCache.ifOffline)) {
                this.subscriberGroups[req.url] = false;
                ob.next(new HttpResponse({body: cache, status: 200}));
                ob.complete();
                return;
              }

              next.handle(req).subscribe({
                next: async res => {
                  ob.next(res);
                  if (res instanceof HttpResponse) {
                    try {
                      const bodyConstraint = (matchCache.ifBody ? matchCache.ifBody(res.body) : true);
                      if (bodyConstraint) {
                        await this.cacheService.set(key, httpCache.storage, res.body, httpCache.timeout ?? TimeSpan.fromMinute(10));
                      }
                    } finally {
                      this.subscriberGroups[key] = false;
                    }
                  }
                },
                error: err => {
                  try {
                    ob.error(err);
                  } finally {
                    this.subscriberGroups[key] = false;
                  }
                },
                complete: () => ob.complete(),
              });
              return;
            }
          }

          next.handle(req).subscribe({
            next: res => ob.next(res),
            error: e => ob.error(e),
            complete: () => ob.complete(),
          });
        });
      }
    )
  }

}
