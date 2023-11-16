import {Observable, Subject} from "rxjs";
import {TimeSpan} from "../contracts";
import {IndexedDB, ITable} from "../utils";

const sameKeyEvent: { [key: string]: Subject<any> } = {}

interface CacheItem<T> {
  expireTime: number;
  data: T;
}

export interface IStorage {
  get<T>(key: string): Promise<T | undefined>;

  set<T>(key: string, value: T | undefined): Promise<void>;

  remove(key: string): Promise<void>;

  removeAll(): Promise<void>;
}

export class MemoryStorage implements IStorage {
  cache: any = {};
  private readonly prefix: string;

  constructor(prefix?: string) {
    this.prefix = prefix ?? 'cache-';
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache[this.prefix + key];
  }

  async set<T>(key: string, value: T | undefined) {
    this.cache[this.prefix + key] = value;
  }

  async remove(key: string) {
    delete this.cache[this.prefix + key];
  }

  async removeAll() {
    this.cache = {};
  }
}


class JsonStorage implements IStorage {
  protected readonly prefix: string;

  constructor(protected storage: Storage, prefix?: string) {
    this.prefix = prefix ?? 'cache-';
  }

  async get<T>(key: string): Promise<T | undefined> {
    const jsonString = this.storage.getItem(this.prefix + key);
    if (!jsonString) return undefined;
    const jsonObject = JSON.parse(jsonString);
    if (!jsonObject) return undefined;
    return jsonObject as T;
  }

  async set<T>(key: string, value: T | undefined) {
    this.storage.setItem(this.prefix + key, JSON.stringify(value));
  }

  async remove(key: string) {
    this.storage.removeItem(key);
  }

  async removeAll() {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.indexOf(this.prefix) == 0) keys.push(key);
    }
    keys.forEach(x => this.storage.removeItem(x));
  }
}

export class LocalStorage extends JsonStorage {

  constructor(prefix: string = 'cache-') {
    super(localStorage, prefix);
  }
}

export class SessionStorage extends JsonStorage {

  constructor(prefix?: string) {
    super(sessionStorage, prefix);
  }
}

interface IndexDbCacheRecord {
  key: string;
  value: any;
}

export class IndexDbStorage implements IStorage {
  caches!: ITable<IndexDbCacheRecord>;
  private readonly db: IndexedDB;
  private readonly prefix: string;

  constructor(options: { dbName?: string, prefix?: string } = {}) {
    this.db = new IndexedDB({name: options.dbName ?? 'caches', version: 2});
    this.prefix = options.prefix ?? 'cache-';
    this.db.create('caches', {key: 'key'});
    this.db.open().then(() => {
      this.caches = this.db.table('caches')
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.db.open();
    const record = await this.caches.get(this.prefix + key);
    return record?.value;
  }

  async remove(key: string) {
    await this.db.open();
    return this.caches.delete(this.prefix + key);
  }

  async removeAll() {
    await this.db.open();
    return this.caches.deleteAll();
  }

  async set<T>(key: string, value: T | undefined) {
    await this.db.open();
    await this.caches.put({key: this.prefix + key, value: value});
  }
}


export class CacheService {

  async get<T = any>(key: string, storage: IStorage, options?: { ignoreExpiration: boolean }): Promise<T | undefined> {
    try {
      const obj = await storage.get<CacheItem<T>>(key);
      if (!obj || options?.ignoreExpiration || obj.expireTime < new Date().getTime()) {
        return undefined;
      }
      return obj.data;
    } catch {
      return undefined;
    }
  }

  getObservable<T = any>(key: string, storage: IStorage, action: Observable<T>, lifetime: TimeSpan): Observable<T> {
    return new Observable(ob => {
      this.get<T>(key, storage).then(result => {
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
          sameKeyEvent[key] = new Subject<any>();
          action.subscribe({
            next: res => {
              sameKeyEvent[key].next(res);
              delete sameKeyEvent[key];
              this.set(key, storage, res, lifetime);
              ob.next(res);
            },
            error: e => ob.error(e),
            complete: () => ob.complete()
          });
        }
      });
    })
  }

  set<T = any>(key: string, storage: IStorage, value: T, lifetime: TimeSpan) {
    try {
      const item: CacheItem<T> = {
        expireTime: new Date().getTime() + lifetime.toSeconds() * 1000,
        data: value,
      }
      return storage.set(key, item);
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve();
  }

  remove(key: string, storage: IStorage) {
    return storage.remove(key);
  }

  removeAll(storage: IStorage) {
    return storage.removeAll();
  }

  exists(key: string, storage: IStorage): boolean {
    return typeof storage.get(key) != 'undefined';
  }
}

export interface ICacheService {

  get<T = any>(key: string): Promise<T | undefined>;

  getObservable<T = any>(key: string, action: Observable<T>, lifetime: TimeSpan): Observable<T>;

  set<T = any>(key: string, value: T, lifetime: TimeSpan): Promise<void>;

  remove(key: string): Promise<void>;

  removeAll(): Promise<void>;

  exists(key: string): Promise<boolean>;
}

export class BaseCacheStorageService implements ICacheService {
  private cacheService: CacheService = new CacheService();

  constructor(private storage: IStorage) {
  }

  get<T = any>(key: string) {
    return this.cacheService.get<T>(key, this.storage);
  }

  getObservable<T = any>(key: string, action: Observable<T>, lifetime: TimeSpan) {
    return this.cacheService.getObservable<T>(key, this.storage, action, lifetime);
  }

  set<T = any>(key: string, value: T, lifetime: TimeSpan) {
    return this.cacheService.set<T>(key, this.storage, value, lifetime);
  }

  remove(key: string) {
    return this.cacheService.remove(key, this.storage);
  }

  removeAll() {
    return this.cacheService.removeAll(this.storage);
  }

  async exists(key: string) {
    return typeof (await this.cacheService.get(key, this.storage)) != 'undefined';
  }

}

export class MemoryCacheService extends BaseCacheStorageService {

  constructor(storage = new MemoryStorage()) {
    super(storage);
  }
}

export const memoryCacheService = new MemoryCacheService();

export class SessionCacheService extends BaseCacheStorageService {

  constructor(storage = new SessionStorage()) {
    super(storage);
  }
}

export const sessionCacheService = new SessionCacheService();

export class LocalCacheService extends BaseCacheStorageService {

  constructor(storage = new LocalStorage()) {
    super(storage);
  }
}

export const localCacheService = new LocalCacheService();

export class IndexedDbCacheService extends BaseCacheStorageService {

  constructor(storage = new IndexDbStorage()) {
    super(storage);
  }
}

export const indexedDbCacheService = new IndexedDbCacheService();
