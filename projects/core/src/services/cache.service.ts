import {EventEmitter, Inject, Injectable, InjectionToken, Optional} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {TimeSpan} from "../models/time-span";

export const CACHE_PREFIX = new InjectionToken<string>('');
export const CACHE_STORAGE = new InjectionToken<Storage>('');
export const CACHE_DEFAULT_LIFETIME = new InjectionToken<TimeSpan>('');

const sameKeyEvent: { [key: string]: Subject<any> } = {}

interface CacheItem<T> {
  expireTime: number;
  data: T;
}

@Injectable({providedIn: 'root'})
export class CacheService {

  constructor(
    @Optional() @Inject(CACHE_PREFIX) private prefix: string = 'cache-',
    @Optional() @Inject(CACHE_STORAGE) private storage: Storage = localStorage,
    @Optional() @Inject(CACHE_DEFAULT_LIFETIME) private defaultLifeTime: TimeSpan = new TimeSpan(0, 1),
  ) {

  }

  get<T = any>(key: string): T | undefined {
    try {
      const jsonString = this.storage.getItem(this.prefix + key);
      if (!jsonString) return undefined;
      const jsonObject = JSON.parse(jsonString) as CacheItem<T>;
      if (!jsonObject) return undefined;
      if (jsonObject.expireTime < new Date().getTime()) {
        return undefined;
      }
      return jsonObject.data;
    } catch {
      return undefined;
    }
  }

  getPromise<T = any>(key: string, action: Promise<T>, lifetime?: TimeSpan): Promise<T> {
    if (!lifetime) lifetime = this.defaultLifeTime;
    return new Promise((resolve, reject) => {
      const result = this.get<T>(key);
      if (result) {
        resolve(result);
      } else {
        action.then(res => {
          this.set(key, res, lifetime);
          resolve(res);
        }).catch(reject);
      }
    })
  }

  getObservable<T = any>(key: string, action: Observable<T>, lifetime?: TimeSpan): Observable<T> {
    if (!lifetime) lifetime = this.defaultLifeTime;
    return new Observable(ob => {
      const result = this.get<T>(key);
      if (result) {
        ob.next(result);
        ob.complete();
      } else if (sameKeyEvent[key]) {
        sameKeyEvent[key].subscribe({
          next: res => ob.next(res),
          error: e => ob.error(e),
          complete: () => ob.complete(),
        });
      } else {
        sameKeyEvent[key] = new EventEmitter();
        action.subscribe({
          next: res => {
            sameKeyEvent[key].next(res);
            delete sameKeyEvent[key];
            this.set(key, res, lifetime);
            ob.next(res);
          },
          error: e => ob.error(e),
          complete: () => ob.complete()
        });
      }
    })
  }

  set<T = any>(key: string, value: T, lifetime?: TimeSpan) {
    if (!lifetime) lifetime = this.defaultLifeTime;
    try {
      const item: CacheItem<T> = {
        expireTime: new Date().getTime() + lifetime.toSeconds() * 1000,
        data: value,
      }
      this.storage.setItem(this.prefix + key, JSON.stringify(item));
    } catch {
    }
  }

  delete(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  deleteAll() {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.indexOf(this.prefix) > -1) keys.push(key);
    }
    keys.forEach(x => this.storage.removeItem(x));
  }

  exists(key: string): boolean {
    return typeof this.storage.getItem(this.prefix + key) != 'undefined';
  }
}
