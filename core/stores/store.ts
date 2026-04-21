import {BehaviorSubject} from "rxjs";
import {CacheStorageIndexDb, ICacheService, IndexedDbCacheService} from '../services/cache.service';
import {TimeSpan} from '../contracts/time-span';


interface ChangeEvent<T> {
    store: T;
    changes: (keyof T & string)[]
}

export class Store<T extends object> {
    $change!: BehaviorSubject<ChangeEvent<T>>;

    protected readonly cacheService!: ICacheService;

    protected $changeByKeys: { [key: string]: BehaviorSubject<T> } = {}
    private readonly _store: any = {};

    constructor(protected name: string, public defaults?: T) {
        try {
            this.cacheService = new IndexedDbCacheService(new CacheStorageIndexDb({dbName: 'store'}));
            this.$change = new BehaviorSubject<ChangeEvent<T>>({
                store: this._store,
                changes: []
            });
            this.$change.subscribe(e => {
                e.changes.forEach(key => {
                    this.$changeByKeys[key]?.next(e.store);
                });
                if (e.changes.length == 0) {
                    Object.values(this.$changeByKeys).forEach(x => {
                        x.next(e.store)
                    });
                }
                this.$changeByKeys['all']?.next(e.store);
            });
        } catch (e) {
            console.error('Store: ' + name + ' construct failed - ' + e)
        }
    }

    get store(): T {
        for (let defaultsKey in this.defaults) {
            if (typeof this._store[defaultsKey] === 'undefined') {
                this._store[defaultsKey] = this.defaults[defaultsKey];
            }
        }
        return this._store;
    }

    on(key: keyof T & string | 'all') {
        return this.$changeByKeys[key] ??= new BehaviorSubject<any>(this._store);
    }

    async set(name: keyof T & string, value: any) {
        if (value === undefined || value === null) delete this._store[name]
        else this._store[name] = value;
        await this.save();
        this.$change.next({store: this._store, changes: [name]});
    }

    async save() {
        await this.cacheService.set(this.name, this._store, TimeSpan.fromMonth(2));
    }

    async load() {
        const item = await this.cacheService.get<T>(this.name);
        Object.assign(this._store, item ?? this.defaults);
        this.$change.next({store: this._store, changes: []});
    }

    async remove(name: keyof T & string) {
        delete this._store[name];
        this.$change.next({store: this._store, changes: [name]});
    }

    async delete() {
        await this.cacheService.remove(this.name);
        for (const storeKey in this._store) {
            delete this._store[storeKey];
        }
    }
}
