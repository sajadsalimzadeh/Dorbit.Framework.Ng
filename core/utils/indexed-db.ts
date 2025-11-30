import { IDatabase, ITable, ITableChangeEvent, ITableConfig } from "./database";
import { Subject } from "rxjs";

export class IndexedDB implements IDatabase {
    private db?: IDBDatabase;
    private tables: { [name: string]: ITableConfig } = {};

    constructor(private options: { name: string, version: number }) {

    }

    open() {
        if (this.db) return Promise.resolve(this.db);
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(this.options.name, this.options.version);
            request.onupgradeneeded = () => {
                this.db = request.result;
                for (const name in this.tables) {
                    const config = this.tables[name];
                    if (!this.db.objectStoreNames.contains(name)) {
                        this.db.createObjectStore(name, {
                            autoIncrement: config.autoIncrement,
                            keyPath: config.key
                        });
                    }
                }
            }
            request.onerror = (e) => {
                reject(request.error);
            }
            request.onsuccess = (e: any) => {
                this.db = e.target.result;
                if (!this.db) return reject('db not found');
                this.db.addEventListener('close', () => {
                    this.db = undefined;
                });
                this.db.addEventListener('error', (e) => {
                    this.db?.close();
                    this.db = undefined;
                });
                this.db.addEventListener('versionchange', (e) => {
                    this.db?.close();
                    this.db = undefined;
                });
                resolve(this.db);
            };
            request.onblocked = (e) => {
                reject(e);
            }
        })
    }

    async close() {
        this.db?.close();
    }

    create(name: string, config: ITableConfig) {
        this.tables[name] = config;
    }

    table<T = any, TP = string>(name: string): ITable<T, TP> {
        return new Table<T, TP>(name, this.tables[name], this);
    }

    public async get(tableName: string, id: any) {
        return new Promise<any>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readonly');
            const store = tx.objectStore(tableName);
            const result = this.toPromise(() => store.get(id));
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error);
        });
    }

    public async getAll(tableName: string, query?: IDBValidKey | IDBKeyRange | null | undefined, count?: number | undefined) {
        return new Promise<any[]>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readonly');
            const store = tx.objectStore(tableName);
            const results = this.toPromise(() => store.getAll(query, count));
            tx.oncomplete = () => resolve(results);
            tx.onerror = () => reject(tx.error);
        });
    }

    public async findAll(tableName: string, query: (key: any, value: any) => boolean, count: number) {
        return new Promise<any[]>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readonly');
            const store = tx.objectStore(tableName);
            const cursorRequest = store.openCursor();
            const items: any[] = [];
            cursorRequest.onsuccess = (e) => {
                const cursor = cursorRequest.result;
                if (items.length >= count) {
                    resolve(items);
                    return;
                }
                if (cursor) {
                    if (query(cursor.key, cursor.value)) {
                        items.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(items)
                }
            }
        });
    }

    public async findAllKey(tableName: string, query: (key: any) => boolean, count: number) {
        return new Promise<any[]>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readonly');
            const store = tx.objectStore(tableName);
            const cursorRequest = store.openKeyCursor();
            const items: any[] = [];
            cursorRequest.onsuccess = (e) => {
                const cursor = cursorRequest.result;
                if (items.length >= count) {
                    resolve(items);
                    return;
                }
                if (cursor) {
                    if (query(cursor.key)) {
                        items.push(cursor.key);
                    }
                    cursor.continue();
                } else {
                    resolve(items)
                }
            }
        });
    }

    public async add(tableName: string, value: any) {
        return new Promise<any>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            store.add(value);
            tx.oncomplete = () => resolve(value);
            tx.onerror = () => reject(tx.error);
        });
    }

    public async addAll(tableName: string, values: any[]) {
        return new Promise<boolean>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            for (const value of values) {
                store.add(value);
            }
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }

    public async put(tableName: string, value: any) {
        return new Promise<any>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            store.put(value);
            tx.oncomplete = () => resolve(value);
            tx.onerror = () => reject(tx.error);
        });
    }

    public async putAll(tableName: string, values: any[]) {
        return new Promise<boolean>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            for (const value of values) store.put(value);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    }

    public async delete(tableName: string, id: any) {
        return new Promise<void>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            store.delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    public async deleteAll(tableName: string, keys?: any[]) {
        return new Promise<void>(async (resolve, reject) => {
            const db = await this.open();
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            keys ??= await this.toPromise(() => store.getAllKeys()) ?? [];
            for (const key of keys) store.delete(key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    private toPromise<T = any>(action: () => IDBRequest, ...args: any[]) {
        return new Promise<T>((resolve, reject) => {
            try {
                const request = action();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => {
                    reject(request.error);
                    if (args.length > 0) console.error(...args);
                }
            } catch (ex) {
                reject(ex);
                if (args.length > 0) console.error(...args);
            }
        });
    }
}

class Table<T, TP> implements ITable<T, TP> {
    $change = new Subject<ITableChangeEvent<T>>();
    private cache: any = {}

    constructor(private name: string, private config: ITableConfig, private database: IDatabase) {
    }

    get(id: TP) {
        return this.database.get(this.name, id);
    }

    getWithCache(id: TP) {
        let item = this.cache[id];
        if (!item) {
            item = this.get(id);
            this.cache[id] = item;
        }
        return item;
    }

    getAll(query?: IDBValidKey | IDBKeyRange | null | undefined, count?: number | undefined) {
        return this.database.getAll(this.name, query, count);
    }

    async add(value: T) {
        if (this.config.keyGenerator) {
            (value as any)[this.config.key] = this.config.keyGenerator();
        }
        const result = await this.database.add(this.name, value);
        this.$change.next({ action: 'add', value: value });
        return result;
    }

    async addAll(values: T[]) {
        if (this.config.keyGenerator) {
            for (const value of values) {
                (value as any)[this.config.key] = this.config.keyGenerator();
            }
        }
        const result = await this.database.addAll(this.name, values);
        this.$change.next({ action: 'add-all', values: values });
        return result;
    }

    async put(value: T) {
        const result = await this.database.put(this.name, value);
        this.$change.next({ action: 'put', value: value });
        return result;
    }

    async putAll(values: T[]) {
        const result = await this.database.putAll(this.name, values);
        this.$change.next({ action: 'put-all', values: values });
        return result;
    }

    findAll(query: (key: TP, value: T) => boolean, count: number = 10000000) {
        return this.database.findAll(this.name, query, count)
    }

    findAllKey(query: (key: TP) => boolean, count: number) {
        return this.database.findAllKey(this.name, query, count)
    }

    async count(query?: (key: TP, value: T) => boolean) {
        return (await this.findAll(query ?? (() => true))).length
    }

    async delete(key: TP) {
        await this.database.delete(this.name, key);
        this.$change.next({ action: 'delete' });
    }

    async deleteAll(keys: TP[]) {
        await this.database.deleteAll(this.name, keys);
        this.$change.next({ action: 'delete-all' });
    }
}
