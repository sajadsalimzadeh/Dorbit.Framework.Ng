import {Inject, Injectable, InjectionToken, Injector, isDevMode, Optional} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {TimeSpan} from "../contracts/time-span";
import {internetStateService} from "../services/internet-state.service";
import {CacheService, CacheStorageIndexDb, ICacheStorage} from "../services/cache.service";
import {delay} from "../utils/delay";
import {APP_VERSION} from "../types";

export interface HttpCacheBase {
    url: RegExp | string;
    methods: string[],
    lazy?: boolean;
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
    subscriberGroups: { [key: string]: boolean } = {};
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
                this.matchItems.unshift({
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
                            const keys = await httpCache.storage.getAllKeys();
                            keys.filter(async key => {
                                if (typeof matchCache.httpCache.url == 'string') {
                                    if (key.includes(matchCache.httpCache.url)) {
                                        await this.cacheService.remove(key, httpCache.storage);
                                    }
                                } else {
                                    if (matchCache.httpCache.url.test(key)) {
                                        await this.cacheService.remove(key, httpCache.storage);
                                    }
                                }
                            })

                        } else {

                            while (this.subscriberGroups[key]) {
                                await delay(50);
                            }
                            this.subscriberGroups[key] = true;

                            const cache = await this.cacheService.getItem(key, httpCache.storage);
                            const isOffline = !internetStateService.$status.value;
                            if (isOffline) {
                                if (cache.data) {
                                    this.subscriberGroups[req.url] = false;
                                    ob.next(new HttpResponse({body: cache.data, status: 200}));
                                    ob.complete();
                                    return;
                                }
                            } else {
                                if (cache.data && !matchCache.constraints?.offline) {

                                    if (matchCache.lazy) {
                                        this.subscriberGroups[req.url] = false;
                                        ob.next(new HttpResponse({body: cache.data, status: 200}));
                                        if (matchCache.httpCache.timeout && !cache.expired && !cache.invalidVersion) {
                                            ob.complete();
                                            return;
                                        }
                                    } else {
                                        if (!cache.expired && !cache.invalidVersion) {
                                            this.subscriberGroups[req.url] = false;
                                            ob.next(new HttpResponse({body: cache.data, status: 200}));
                                            ob.complete();
                                            return;
                                        }
                                    }
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
                                        if (cache?.data) ob.next(cache.data)
                                        else ob.error(err);
                                    } catch (e) {
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
