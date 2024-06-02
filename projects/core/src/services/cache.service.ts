import {Observable, Subject} from "rxjs";
import {TimeSpan} from "../contracts";
import {IndexedDB, ITable} from "../utils";

const sameKeyEvent: { [key: string]: Subject<any> } = {}

interface CacheItem<T> {
  data: T;
  expireTime: number;
  version?: string;
}

export interface ICacheStorage {
  get<T>(key: string): Promise<T | undefined>;

  getAllKeys(): Promise<string[]>;

  set<T>(key: string, value: T | undefined): Promise<void>;

  remove(key: string): Promise<void>;

  removeAll(): Promise<void>;
}

export class CacheStorageMemory implements ICacheStorage {
  cache: any = {};
  private readonly prefix: string;

  constructor(prefix?: string) {
    this.prefix = prefix ?? 'cache-';
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache[this.prefix + key];
  }

  async getAllKeys(): Promise<string[]> {
    const keys = Object.keys(this.cache);
    for (let i = 0; i < keys.length; i++) {
      keys[i] = keys[i].substring(this.prefix.length);
    }
    return keys;
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

class CacheStorageJson implements ICacheStorage {
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

  async getAllKeys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) keys.push(key.substring(this.prefix.length));
    }
    return keys;
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

export class CacheStorageLocal extends CacheStorageJson {

  constructor(prefix: string = 'cache-') {
    super(localStorage, prefix);
  }
}

export class CacheStorageSession extends CacheStorageJson {

  constructor(prefix?: string) {
    super(sessionStorage, prefix);
  }
}

interface IndexDbCacheRecord {
  key: string;
  value: any;
}

export class CacheStorageIndexDb implements ICacheStorage {
  caches!: ITable<IndexDbCacheRecord>;
  private readonly db: IndexedDB;
  private readonly prefix: string;

  constructor(options: { dbName?: string, prefix?: string } = {}) {
    this.db = new IndexedDB({name: options.dbName ?? 'cache', version: 3});
    this.prefix = options.prefix ?? 'cache-';
    this.db.create('items', {key: 'key'});
    this.db.open().then(() => {
      this.caches = this.db.table('items')
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.db.open();
    const record = await this.caches.get(this.prefix + key);
    return record?.value;
  }

  async getAllKeys(): Promise<string[]> {
    const keys = await this.caches.findAllKey(x => true, 10000);
    for (let i = 0; i < keys.length; i++) {
      keys[i] = keys[i].substring(this.prefix.length);
    }
    return keys;
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

class CacheResult<T> {
  data: T;
  expired: boolean = false;
  invalidVersion: boolean = false;

  constructor(data: T) {
    this.data = data;
  }
}

interface CacheGetOptions {
  validateExpiration: boolean;
  validateVersion: boolean;
}

export class CacheService {
  version?: string;

  async getItem<T = any>(key: string, storage: ICacheStorage): Promise<CacheResult<T | undefined>> {
    const result = new CacheResult<T | undefined>(undefined);
    try {
      const obj = await storage.get<CacheItem<T>>(key);
      if (!obj) return result;
      result.data = obj.data;
      if (obj.expireTime < new Date().getTime()) {
        // console.log('[cache] ignore for expiration,', key)
        result.expired = true;
      }
      if (obj.version != this.version) {
        // console.log('[cache] ignore for version,', key)
        result.invalidVersion = true;
      }
    } catch {
    }
    return result;
  }

  async get<T = any>(key: string, storage: ICacheStorage, options?: CacheGetOptions): Promise<T | undefined> {
    const item = await this.getItem(key, storage);
    if (options?.validateExpiration && item.expired) return undefined;
    if (options?.validateVersion && item.invalidVersion) return undefined;
    return item.data
  }

  getObservable<T = any>(key: string, storage: ICacheStorage, action: Observable<T>, lifetime: TimeSpan): Observable<T> {
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

  set<T = any>(key: string, storage: ICacheStorage, value: T, lifetime: TimeSpan) {
    try {
      const item: CacheItem<T> = {
        expireTime: new Date().getTime() + lifetime.toSeconds() * 1000,
        version: this.version,
        data: value,
      }
      return storage.set(key, item);
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve();
  }

  remove(key: string, storage: ICacheStorage) {
    return storage.remove(key);
  }

  removeAll(storage: ICacheStorage) {
    return storage.removeAll();
  }

  exists(key: string, storage: ICacheStorage): boolean {
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

  constructor(private storage: ICacheStorage) {
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

  constructor(storage = new CacheStorageMemory()) {
    super(storage);
  }
}


export class SessionCacheService extends BaseCacheStorageService {

  constructor(storage = new CacheStorageSession()) {
    super(storage);
  }
}

export class LocalCacheService extends BaseCacheStorageService {

  constructor(storage = new CacheStorageLocal()) {
    super(storage);
  }
}

export class IndexedDbCacheService extends BaseCacheStorageService {

  constructor(storage = new CacheStorageIndexDb()) {
    super(storage);
  }
}

export const memoryCacheService = new MemoryCacheService();
export const sessionCacheService = new SessionCacheService();
export const localCacheService = new LocalCacheService();
export const indexedDbCacheService = new IndexedDbCacheService();
