import {Inject, Injectable, InjectionToken, Injector, isDevMode, Optional} from '@angular/core';
import {HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TimeSpan} from "../contracts";
import {internetStateService} from "../services/internet-state.service";
import {CacheService, CacheStorageIndexDb, ICacheStorage} from "../services";
import {delay} from "../utils";
import {APP_VERSION} from "../types";

export interface HttpCacheBase {
  url: RegExp | string;
  methods: string[],
  constraints?: {
    offline?: boolean;
    version?: boolean;
    production?: boolean;
    body?: (body: any) => boolean;
  }
}

export interface HttpCache extends HttpCacheBase {
  storage?: ICacheStorage;
  timeout?: TimeSpan;
  evictions?: HttpCacheBase[]
}

interface HttpCacheExtended extends HttpCache {
  storage: ICacheStorage;
}

export const HTTP_CACHE = new InjectionToken<HttpCache[]>('Http Cache');


@Injectable({providedIn: 'root'})
export class CacheInterceptor implements HttpInterceptor {
  private cacheService: CacheService = new CacheService();

  private readonly matchItems: (HttpCacheBase & { isEviction: boolean, httpCache: HttpCacheExtended })[] = [];

  constructor(
    private injector: Injector,
    @Inject(HTTP_CACHE) @Optional() private readonly httpCaches: HttpCacheExtended[],) {
    const storage = new CacheStorageIndexDb({prefix: 'cache-http-'});
    this.httpCaches ??= [];
    this.httpCaches.forEach(x => x.storage ??= storage)
    this.httpCaches.forEach(x => {
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

    this.httpCaches = this.httpCaches.map(x => ({
      ...x,
      storage: x.storage ?? storage
    }));
  }

  subscriberGroups: { [key: string]: boolean } = {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.cacheService.version) {
      const version = this.injector.get(APP_VERSION, undefined, {optional: true});
      if (version) this.cacheService.version = version();
    }

    return new Observable<HttpEvent<any>>(ob => {
        setTimeout(async () => {
          const method = req.method.toLowerCase();
          const matchCaches = this.matchItems.filter(x => {
            x.constraints ??= {};
            if (!x.methods.includes(method)) return false;
            if (typeof x.url === 'string') return req.url.includes(x.url);
            if (x.constraints.production && isDevMode()) return false;
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
              if (isOffline) {

                const cache = await this.cacheService.get(key, httpCache.storage, {ignoreExpiration: true, ignoreVersion: true});
                if (cache) {
                  this.subscriberGroups[req.url] = false;
                  ob.next(new HttpResponse({body: cache, status: 200}));
                  ob.complete();
                  return;
                }
              } else {
                const cache = await this.cacheService.get(key, httpCache.storage);
                if (cache && !matchCache.constraints?.offline) {
                  this.subscriberGroups[req.url] = false;
                  ob.next(new HttpResponse({body: cache, status: 200}));
                  ob.complete();
                  return;
                }
              }

              next.handle(req).subscribe({
                next: async res => {
                  ob.next(res);
                  if (res instanceof HttpResponse) {
                    try {
                      const bodyConstraint = (matchCache.constraints?.body ? matchCache.constraints?.body(res.body) : true);
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
