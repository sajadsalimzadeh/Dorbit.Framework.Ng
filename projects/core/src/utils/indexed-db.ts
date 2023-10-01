import {IDatabase, ITable, ITableConfig} from "./database";
import {BehaviorSubject, Subject} from "rxjs";

export class IndexedDB implements IDatabase {
  private db!: IDBDatabase;
  private tables: { [name: string]: ITableConfig } = {};

  constructor(private options: { name: string, version: number }) {

  }

  open() {
    if (this.db) return Promise.resolve(true);
    return new Promise<boolean>((resolve, reject) => {
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
        resolve(true);
      };
    })

    // request.onupgradeneeded = (event) => {
    //   this.db = request.result;
    //   switch (event.oldVersion) { // existing db version
    //     case 0:
    //     // version 0 means that the client had no database
    //     // perform initialization
    //     case 1:
    //     // client had version 1
    //     // callback
    //   }
    // };
  }

  private toPromise<T = any>(action: () => IDBRequest) {
    return new Promise<T>((resolve, reject) => {
      const request = action();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  create(name: string, config: ITableConfig) {
    this.tables[name] = config;
  }

  table<T = any>(name: string): ITable<T> {
    const config = this.tables[name];

    const table = {
      onSet: new Subject<{ key: string, value: T }>(),
      get: (id: any) => this.get(name, id),
      getAll: () => this.getAll(name),
      set: (value: any) => {
        const key = (value as any)[config.key];
        table.onSet.next({key, value});
        return this.set(name, value);
      },
      add: (value: any) => {
        if (config.keyGenerator) {
          value[config.key] = config.keyGenerator();
        }
        return table.set(value);
      },
      delete: (id: any) => this.delete(name, id),
      deleteAll: () => this.deleteAll(name),
      putBulk: (values: any[]) => this.putBulk(name, values),
      findAll: (query: (key: any, value: any) => boolean, count: number) => this.findAll(name, query, count),
      findAllKey: (query: (key: any) => boolean, count: number) => this.findAllKey(name, query, count),
    } as ITable;
    return table;
  }

  public get(tableName: string, id: any) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.get(id));
  }

  public getAll(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.getAll());
  }

  public findAll(tableName: string, query: (key: any, value: any) => boolean, count: number) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return new Promise<any[]>((resolve, reject) => {
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
            items.push(cursor.key);
          }
          cursor.continue();
        } else {
          resolve(items)
        }
      }
    });
  }

  public findAllKey(tableName: string, query: (key: any) => boolean, count: number) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return new Promise<any[]>((resolve, reject) => {
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

  public set(tableName: string, value: any) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.put(value));
  }

  public async putBulk(tableName: string, values: any[]) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    for (const value of values) {
      await this.toPromise(() => store.put(value));
    }
    return await this.getAll(tableName);
  }

  public delete(tableName: string, id: any) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.delete(id));
  }

  public async deleteAll(tableName: string) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const keys = await this.toPromise(() => store.getAllKeys());

    for (let i = 0; i < keys.length; i++) {
      await this.toPromise(() => store.delete(keys[i]));
    }
  }
}
