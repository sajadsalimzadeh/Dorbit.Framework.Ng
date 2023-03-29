import { HttpClient } from "@angular/common/http";
import {Injectable, Injector} from "@angular/core";
import {CacheService} from "./cache.service";


@Injectable({providedIn: 'root'})
export abstract class HttpService {
    protected http: HttpClient;
    protected cacheService: CacheService;

    protected constructor(protected injector: Injector) {
        this.http = injector.get(HttpClient);
        this.cacheService = injector.get(CacheService);
    }
}
