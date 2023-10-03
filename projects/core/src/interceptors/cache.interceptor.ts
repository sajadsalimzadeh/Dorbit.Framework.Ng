import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CacheService, delay, IndexDbStorage, IStorage, TimeSpan} from "@dorbit";
import {internetStateService} from "../services/internet-state.service";

export interface HttpCacheBase {
  url: RegExp | string;
  methods: string[],
  ifOffline?: boolean;
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

  constructor(@Inject(HTTP_CACHE) private readonly httpCaches: HttpCacheExtended[],
              @Inject(HTTP_CACHE_STORAGE) @Optional() storage: IStorage) {
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
            if(!x.methods.includes(method)) return false;
            if(typeof x.url === 'string') return req.url.includes(x.url);
            return x.url.test(req.url);
          });
          for (const matchCache of matchCaches) {
            const httpCache = matchCache.httpCache;
            if (matchCache.isEviction) {
              await this.cacheService.remove(req.url, httpCache.storage);
            } else {

              while (this.subscriberGroups[req.url]) {
                await delay(50);
              }
              this.subscriberGroups[req.url] = true;

              const cache = await this.cacheService.get(req.url, httpCache.storage);
              if (cache) {
                const internetConstraint = (matchCache.ifOffline ? matchCache.ifOffline == !internetStateService.StatusChange.value : true);
                if (internetConstraint) {
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
                      const bodyConstraint = (matchCache.ifBody ? matchCache.ifBody(res.body) : true);
                      if (bodyConstraint) {
                        await this.cacheService.set(req.url, httpCache.storage, res.body, httpCache.timeout ?? TimeSpan.fromMinute(10));
                      }
                    } finally {
                      this.subscriberGroups[req.url] = false;
                    }
                  }
                },
                error: err => {
                  try {
                    ob.error(err);
                  } finally {
                    this.subscriberGroups[req.url] = false;
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
